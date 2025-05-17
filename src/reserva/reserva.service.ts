import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Maquinaria } from 'src/maquinaria/maquinaria.entity';
import { User } from 'src/user/user.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { Repository } from 'typeorm';
import { Reserva } from './reserva.entity';

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
        const maquinaria = await this.maquinariaRepository.findOneBy({ id: dto.maquinariaId });
        if (!maquinaria) {
            throw new NotFoundException('Maquinaria not found');
        }

        const usuario = await this.userRepository.findOneBy({ email: dto.usuarioEmail });
        if (!usuario) {
            throw new NotFoundException('Usuario not found');
        }

        const reserva = this.reservaRepository.create({
            fecha_inicio: dto.fecha_inicio,
            fecha_fin: dto.fecha_fin,
            maquinaria,
            usuario,
            precio_dia: maquinaria.precio,
            politica: maquinaria.politica,
        });

        return this.reservaRepository.save(reserva);
    }

    async findAll(): Promise<Reserva[]> {
        return this.reservaRepository.find({ relations: ['maquinaria', 'usuario'] });
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