import { Injectable, NotFoundException, BadRequestException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Maquinaria } from 'src/maquinaria/maquinaria.entity';
import { User } from 'src/user/user.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { Repository } from 'typeorm';
import { Reserva, ReservaStates } from './reserva.entity';

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
            politica: maquinaria.politica,
            codigo_reserva: `${maquinaria.inventario}-${usuario.id}-${Date.now()}`,
            estado: ReservaStates.Activa,
        });

        return this.reservaRepository.save(reserva);
    }

    async findAll(): Promise<Reserva[]> {
        return this.reservaRepository.find({ relations: ['maquinaria', 'usuario'] });
    }

    async finalizarReserva(id: number): Promise<Reserva> {
        const reserva = await this.reservaRepository.findOneBy({ id });
        if (!reserva) {
            throw new NotFoundException('Reserva not found');
        }
        reserva.estado = ReservaStates.Finalizada;
        return this.reservaRepository.save(reserva);
    }

    async cancelarReservaUser(id: number, email: string): Promise<Reserva> {
        const reserva = await this.reservaRepository.findOneBy({ id });
        if (!reserva) {
            throw new NotFoundException('Reserva not found');
        }
        if (reserva.usuario.email !== email) {
            throw new BadRequestException('El usuario no tiene permisos para cancelar esta reserva');
        }
        if (reserva.estado !== ReservaStates.Activa) {
            throw new BadRequestException('Reserva no se pudo cancelar');
        }

        reserva.estado = ReservaStates.Cancelada;
        return this.reservaRepository.save(reserva);
    }

    async cancelarReservaAdmin(id: number): Promise<Reserva> {
        const reserva = await this.reservaRepository.findOneBy({ id });
        if (!reserva) {
            throw new NotFoundException('Reserva not found');
        }
        if (reserva.estado !== ReservaStates.Finalizada) {
            throw new BadRequestException('Reserva no se pudo cancelar');
        }
        // + Notificar al usuario
        reserva.estado = ReservaStates.Cancelada;
        return this.reservaRepository.save(reserva);
    }

    async confirmarDevolucion(id: number): Promise<Reserva> {
        const reserva = await this.reservaRepository.findOneBy({ id });
        if (!reserva) {
            throw new NotFoundException('Reserva not found');
        }
        if (reserva.estado !== ReservaStates.Cancelada) {
            throw new BadRequestException('La reserva no está esperando devolución');
        }
        // + Notificar al usuario
        reserva.estado = ReservaStates.Finalizada;
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

    async remove(id: number): Promise<boolean> {
        const result = await this.reservaRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Reserva not found');
        }
        return true;
    }
}