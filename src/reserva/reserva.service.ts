import { Injectable, NotFoundException, BadRequestException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Maquinaria } from 'src/maquinaria/maquinaria.entity';
import { Politica } from "src/utils/enums";
import { User, UserRole } from 'src/user/user.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { In, LessThan, Repository } from 'typeorm';
import { Reserva, ReservaStates } from './reserva.entity';
import { FilterReservaDto } from './dto/filter-reserva.dto';
import { sendMail } from 'src/utils/Mailer';
import { JwtPayload } from 'src/auth/jwt/jwtPayload';
import { Alquiler, AlquilerStates } from 'src/alquiler/alquiler.entity';

@Injectable()
export class ReservaService {
    constructor(
        @InjectRepository(Reserva)
        private readonly reservaRepository: Repository<Reserva>,
        @InjectRepository(Maquinaria)
        private readonly maquinariaRepository: Repository<Maquinaria>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Alquiler)
        private readonly alquilerRepository: Repository<Alquiler>
    ) {}

    async updateTimeout() {
        let res = await this.reservaRepository.find({where: {estado: ReservaStates.Activa, fecha_fin: LessThan(new Date())}});
        for (let reserva of res) {
            reserva.estado = ReservaStates.Vencida;
            await this.reservaRepository.save(reserva);
        }
    }

    async create(dto: CreateReservaDto): Promise<Reserva> {
        const maquinaria = await this.maquinariaRepository.findOneBy({ id: dto.id_maquinaria });
        if (!maquinaria) {
            throw new NotFoundException('Maquinaria not found');
        }

        const usuario = await this.userRepository.findOneBy({ email: dto.email });
        if (!usuario) {
            throw new NotFoundException('Usuario not found');
        }

        if (dto.fecha_inicio >= dto.fecha_fin) {
            throw new BadRequestException('La fecha de inicio debe ser menor que la fecha de fin');
        }

        // Generar codigo de reserva evitando coincidencias
        let timestamp = Date.now();
        let codigo_reserva = `${maquinaria.inventario}-${usuario.id}-${timestamp.toString(36)}`;
        let existingReserva = await this.reservaRepository.findOne({where: {codigo_reserva}});

        while (existingReserva) {
            console.log(`Codigo de reserva ${codigo_reserva} ya existe, generando uno nuevo...`);
            timestamp = Date.now();
            codigo_reserva = `${maquinaria.inventario}-${usuario.id}-${timestamp.toString(36)}`;
            existingReserva = await this.reservaRepository.findOne({where: {codigo_reserva}});
        }


        return this.reservaRepository.save({
            fecha_inicio: dto.fecha_inicio,
            fecha_fin: dto.fecha_fin,
            maquinaria,
            usuario,
            precio_dia: maquinaria.precio,
            precio_total: maquinaria.precio * (dto.fecha_fin.getTime() - dto.fecha_inicio.getTime()) / (1000 * 60 * 60 * 24),
            politica: maquinaria.politica,
            sucursal: maquinaria.sucursal,
            codigo_reserva: codigo_reserva,
            estado: ReservaStates.Activa,
        });
    }

    async findAll(filters?: Partial<FilterReservaDto>, rol?: UserRole): Promise<Reserva[]> {
        await this.updateTimeout();

        const queryBuilder = this.reservaRepository.createQueryBuilder('reserva')
            .leftJoinAndSelect('reserva.maquinaria', 'maquinaria')
            .leftJoin('reserva.usuario', 'usuario')
            .addSelect(['usuario.id', 'usuario.email', 'usuario.nombre']);

        const validStates = this.getValidStates(rol || UserRole.Cliente);
        queryBuilder.andWhere('reserva.estado IN (:...validStates)', { validStates });

        if (filters) {
            if (filters.id) queryBuilder.andWhere('reserva.id = :id', { id: filters.id });
            if (filters.estado) queryBuilder.andWhere('reserva.estado = :estado', { estado: filters.estado });
            if (filters.user_id) queryBuilder.andWhere('reserva.id_usuario = :user_id', { user_id: filters.user_id });
            if (filters.user_email) queryBuilder.andWhere('usuario.email = :user_email', { user_email: filters.user_email });
            if (filters.maquinaria_id) queryBuilder.andWhere('reserva.id_maquinaria = :maquinaria_id', { maquinaria_id: filters.maquinaria_id });
            if (filters.maquinaria_inventario) queryBuilder.andWhere('maquinaria.inventario = :maquinaria_inventario', { maquinaria_inventario: filters.maquinaria_inventario });
            if (filters.sucursal) queryBuilder.andWhere('maquinaria.sucursal = :sucursal', { sucursal: filters.sucursal });

            // Potencialmente problematico
            if (filters.texto) queryBuilder.andWhere('reserva.codigo_reserva LIKE :texto OR maquinaria.nombre LIKE :texto', { texto: filters.texto });
        }

        let lista = await queryBuilder.getMany();

        for (let reserva of lista) {
            let alquileres = await this.alquilerRepository.find({where: {maquinaria: reserva.maquinaria, estado: In([AlquilerStates.Activo, AlquilerStates.Retrasado])}});
            if (alquileres.length > 0) {
                reserva.hideButton = true;
            }
        }
        return lista;
    }

    async confirmarReserva(id: number): Promise<Reserva> {
        const reserva = await this.reservaRepository.findOne({
            where: { id },
            relations: ['usuario', 'maquinaria']
        });
        if (!reserva) {
            throw new NotFoundException('Reserva not found');
        }

        if (reserva.fecha_inicio > new Date() && reserva.estado === ReservaStates.Activa) {
            throw new BadRequestException('La reserva aun no ha comenzado.');
        }

        switch (reserva.estado) {
            case ReservaStates.Cancelada:
                reserva.estado = ReservaStates.Reembolsada;
                break;
            case ReservaStates.Activa:
                const alquileres = await this.alquilerRepository.find({where: {maquinaria: reserva.maquinaria, estado: AlquilerStates.Activo || AlquilerStates.Retrasado}});
                if (alquileres.length > 0) {
                    console.log('Alquiler activo')
                    console.log(alquileres)
                    throw new BadRequestException('La maquinaria tiene un alquiler activo. Confirmá su devolución primero.');
                }
                reserva.estado = ReservaStates.Finalizada;
                await this.alquilerRepository.save(new Alquiler(reserva));
                break;
            case ReservaStates.Finalizada:
                throw new BadRequestException('La reserva ya está finalizada.');
            case ReservaStates.Reembolsada:
                throw new BadRequestException('La reserva ya ha sido reembolsada.');
            case ReservaStates.Vencida:
                throw new BadRequestException('La reserva ya está vencida.');
            default:
                // No se debería llegar a este punto
                throw new BadRequestException('La reserva no puede ser confirmada.');
        }
        return this.reservaRepository.save(reserva);
    }

    async confirmarReservaHard(id: number): Promise<Reserva> {
        const reserva = await this.reservaRepository.findOne({
            where: { id },
            relations: ['usuario', 'maquinaria']
        });
        if (!reserva) {
            throw new NotFoundException('Reserva not found');
        }
        reserva.estado = ReservaStates.Finalizada;
        await this.alquilerRepository.save(new Alquiler(reserva));
        return this.reservaRepository.save(reserva);
    }

    async cancelarReserva(id: number, user: JwtPayload): Promise<Reserva> {
        const reserva = await this.reservaRepository.findOne({
            where: { id },
            relations: ['maquinaria', 'usuario'],
        });
        if (!reserva) {
            throw new NotFoundException('Reserva not found');
        }
        if (reserva.estado !== ReservaStates.Activa) {
            throw new BadRequestException('Reserva no se puede cancelar');
        }
        switch (user.rol) {
            case UserRole.Cliente:
                if (reserva.usuario.id !== user.id) {
                    throw new BadRequestException('No tienes permiso para cancelar esta reserva');
                }
                if (reserva.fecha_inicio <= new Date()) {
                    throw new BadRequestException('No se puede cancelar la reserva después de la fecha de inicio');
                }
                if (reserva.politica === Politica.devolucion_0) {
                    // Tal vez sea util mas adelante
                    reserva.estado = ReservaStates.Reembolsada;
                    reserva.estado = ReservaStates.Cancelada;
                }
                else reserva.estado = ReservaStates.Cancelada;
                break;
            case UserRole.Empleado:
                reserva.politica = Politica.devolucion_100;
                reserva.estado = ReservaStates.Cancelada;
                break;
            case UserRole.Admin:
                reserva.politica = Politica.devolucion_100;
                reserva.estado = ReservaStates.Cancelada;
                break;
            default:
                throw new BadRequestException('No tienes permiso para cancelar la reserva');
        }

        const maq = reserva.maquinaria

        let mail = `La reserva '${reserva.codigo_reserva}' de la maquinaria
        - Nombre: ${maq.nombre}
        - Marca: ${maq.marca}
        - Modelo: ${maq.modelo}
        - Desde: ${reserva.fecha_inicio.toISOString().split('T')[0]}
        - Hasta: ${reserva.fecha_fin.toISOString().split('T')[0]}
        ha sido cancelada.
        Te recordamos que la política de reembolso que te corresponde es: ${reserva.politica}.
        ${reserva.politica !== Politica.devolucion_0 ? `Podés retirar el reembolso en la sucursal ${reserva.sucursal}` : ''}`;

        sendMail(reserva.usuario.email, "Reserva Cancelada", mail);
        return this.reservaRepository.save(reserva);
    }

    async findOne(id: number): Promise<any> {
        await this.updateTimeout();
        const reserva = await this.reservaRepository
            .createQueryBuilder('reserva')
            .leftJoinAndSelect('reserva.maquinaria', 'maquinaria')
            .leftJoin('reserva.usuario', 'usuario')
            .addSelect(['usuario.id', 'usuario.email', 'usuario.nombre'])
            .where('reserva.id = :id', { id })
            .getOne();

        if (!reserva) {
            throw new NotFoundException('Reserva not found');
        }
        return reserva;
    }

    getValidStates(rol: UserRole): string[] {
        switch (rol) {
            case UserRole.Cliente:
                return [ReservaStates.Activa, ReservaStates.Cancelada, ReservaStates.Reembolsada, ReservaStates.Vencida];
            case UserRole.Empleado:
                return [ReservaStates.Activa, ReservaStates.Cancelada, ReservaStates.Reembolsada, ReservaStates.Vencida];
            case UserRole.Admin:
                return [ReservaStates.Activa, ReservaStates.Cancelada, ReservaStates.Reembolsada, ReservaStates.Vencida];
            default:
                throw new BadRequestException('Rol no válido para obtener estados de reserva');
        }
    }

    async remove(id: number): Promise<boolean> {
        const result = await this.reservaRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Reserva not found');
        }
        return true;
    }
}