import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EstadisticasDto } from './dto/estadisticas.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Not, Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Alquiler } from 'src/alquiler/alquiler.entity';
import { Maquinaria } from 'src/maquinaria/maquinaria.entity';
import { Reserva } from 'src/reserva/reserva.entity';
import { UserRole } from 'src/user/user.entity';


@Injectable()
export class EstadisticasService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Reserva)
        private readonly reservaRepository: Repository<Reserva>,
        @InjectRepository(Maquinaria)
        private readonly maquinariaRepository: Repository<Maquinaria>,
        @InjectRepository(Alquiler)
        private readonly alquilerRepository: Repository<Alquiler>,
        
    ) {}

    async getUserStats(query: EstadisticasDto): Promise<{ fecha: string, cantidad: number }[]> {
        let { fecha_inicio, fecha_fin } = query;

        if (!fecha_inicio) { 
            const primerUsuario = await this.userRepository.findOne({
                where: { rol: UserRole.Cliente },
                order: { fecha_creacion: 'ASC' },
                select: ['fecha_creacion'],
            });
            fecha_inicio = primerUsuario ? primerUsuario.fecha_creacion : new Date('2020-01-01');
        }
        if (!fecha_fin) { fecha_fin = new Date(); }

        const users = await this.userRepository.find({
            where: {
                rol: UserRole.Cliente,
                fecha_creacion: Between(fecha_inicio, fecha_fin)
            },
            select: ['fecha_creacion']
        });

        const start = new Date(fecha_inicio);
        const end = new Date(fecha_fin);
        const result: { fecha: string, cantidad: number }[] = [];

        for (
            let d = new Date(start);
            d <= end;
            d.setDate(d.getDate() + 1)
        ) {
            const dateStr = d.toISOString().slice(0, 10);
            const cantidad = users.filter(u => u.fecha_creacion.toISOString().slice(0, 10) === dateStr).length;
            result.push({ fecha: dateStr, cantidad });
        }

        return result;
    }
}