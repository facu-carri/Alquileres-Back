import { Injectable, NotFoundException, BadRequestException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Maquinaria, ReturnPolicy } from 'src/maquinaria/maquinaria.entity';
import { User, UserRole } from 'src/user/user.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { Repository } from 'typeorm';
import { Reserva, ReservaStates } from './reserva.entity';
import { FilterReservaDto } from './dto/filter-reserva.dto';

@Injectable()
export class ReservaService {
    constructor(
        @InjectRepository(Reserva)
        private readonly reservaRepository: Repository<Reserva>,
        @InjectRepository(Maquinaria)
        private readonly maquinariaRepository: Repository<Maquinaria>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(dto: CreateReservaDto): Promise<Reserva> {
        const maquinaria = await this.maquinariaRepository.findOneBy({ id: dto.id_maquinaria });
        if (!maquinaria) {
            throw new NotFoundException('Maquinaria not found');
        }

        const usuario = await this.userRepository.findOneBy({ email: dto.email_usuario });
        if (!usuario) {
            throw new NotFoundException('Usuario not found');
        }

        if (dto.fecha_inicio >= dto.fecha_fin) {
            throw new BadRequestException('La fecha de inicio debe ser menor que la fecha de fin');
        }

        const reserva = this.reservaRepository.create({
            fecha_inicio: dto.fecha_inicio,
            fecha_fin: dto.fecha_fin,
            maquinaria,
            usuario,
            precio_dia: maquinaria.precio,
            precio_total: maquinaria.precio * (dto.fecha_fin.getTime() - dto.fecha_inicio.getTime()) / (1000 * 60 * 60 * 24),
            politica: maquinaria.politica,
            sucursal: maquinaria.sucursal,
            codigo_reserva: `${maquinaria.inventario}-${usuario.id}-${Date.now()}`,
            estado: ReservaStates.Activa,
        });

        return this.reservaRepository.save(reserva);
    }

    async findAll(filters?: FilterReservaDto): Promise<Reserva[]> {
        const queryBuilder = this.reservaRepository.createQueryBuilder('reserva')
            .leftJoinAndSelect('reserva.maquinaria', 'maquinaria')
            .leftJoinAndSelect('reserva.usuario', 'usuario');

        if (filters) {
            if (filters.id) queryBuilder.andWhere('reserva.id = :id', { id: filters.id });
            if (filters.codigo_reserva) queryBuilder.andWhere('reserva.codigo_reserva = :codigo_reserva', { codigo_reserva: filters.codigo_reserva });
            if (filters.estado) queryBuilder.andWhere('reserva.estado = :estado', { estado: filters.estado });
            if (filters.user_id) queryBuilder.andWhere('reserva.id_usuario = :user_id', { user_id: filters.user_id });
            if (filters.user_email) queryBuilder.andWhere('usuario.email = :user_email', { user_email: filters.user_email });
            if (filters.maquinaria_id) queryBuilder.andWhere('reserva.id_maquinaria = :maquinaria_id', { maquinaria_id: filters.maquinaria_id });
            if (filters.maquinaria_inventario) queryBuilder.andWhere('maquinaria.inventario = :maquinaria_inventario', { maquinaria_inventario: filters.maquinaria_inventario });
        }

        return queryBuilder.getMany();
    }

    async confirmarReserva(id: number): Promise<Reserva> {
        const reserva = await this.reservaRepository.findOneBy({ id });
        if (!reserva) {
            throw new NotFoundException('Reserva not found');
        }

        switch (reserva.estado) {
            case ReservaStates.Cancelada:
                reserva.estado = ReservaStates.Reembolsada;
                break;
            case ReservaStates.Activa:

                // TO DO: ACÁ VA EL CODIGO PARA CREAR UN NUEVO ALQUILER

                reserva.estado = ReservaStates.Finalizada;
                break;
            case ReservaStates.Finalizada:
                throw new BadRequestException('La reserva ya está finalizada.');
            case ReservaStates.Reembolsada:
                throw new BadRequestException('La reserva ya ha sido reembolsada.');
            default:
                // No se debería llegar a este punto
                throw new BadRequestException('La reserva no puede ser confirmada.');
        }

        return this.reservaRepository.save(reserva);
}

    async cancelarReserva(id: number, user: User): Promise<Reserva> {
        const reserva = await this.reservaRepository.findOneBy({ id });
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
                if (reserva.politica === ReturnPolicy.devolucion_0) {
                    reserva.estado = ReservaStates.Reembolsada;
                }
                else reserva.estado = ReservaStates.Cancelada;
                break;
            case UserRole.Admin || UserRole.Empleado:
                reserva.politica = ReturnPolicy.devolucion_100;
                reserva.estado = ReservaStates.Cancelada;
                break;
            default:
                throw new BadRequestException('No tienes permiso para cancelar la reserva');
        }
        return this.reservaRepository.save(reserva);
    }

    async findOne(id: number): Promise<Reserva | null> {
        const reserva = await this.reservaRepository.findOne({
            where: { id },
            relations: ['maquinaria', 'usuario'],
        });
        if (!reserva) {
            throw new NotFoundException('Reserva not found');
        }
        return reserva;
    }

    getValidStates(rol: UserRole): string[] {
        switch (rol) {
            case UserRole.Cliente:
                return [ReservaStates.Activa, ReservaStates.Cancelada];
            case UserRole.Empleado:
                return [ReservaStates.Activa, ReservaStates.Cancelada];
            case UserRole.Admin:
                return [ReservaStates.Activa, ReservaStates.Cancelada, ReservaStates.Finalizada, ReservaStates.Reembolsada];
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