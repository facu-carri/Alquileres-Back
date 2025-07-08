import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EstadisticasDto } from './dto/estadisticas.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Not, Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Alquiler, AlquilerStates } from 'src/alquiler/alquiler.entity';
import { Maquinaria } from 'src/maquinaria/maquinaria.entity';
import { Reserva } from 'src/reserva/reserva.entity';
import { UserRole } from 'src/user/user.entity';


@Injectable()
export class EstadisticasService {

    // define si mandar o no los campos que tienen valor 0. False para testear la salida, True para hacer mas facil la implementacion en front
    readonly SEND_ALL = true;
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
    let { fecha_inicio, fecha_fin, tam } = query;

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

    // Grouping logic
    const map = new Map<string, number>();

    for (const user of users) {
        const date = new Date(user.fecha_creacion);
        let key: string;
        if (tam === 'anio') {
            key = date.getFullYear().toString();
        } else if (tam === 'mes') {
            key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        } else {
            key = date.toISOString().slice(0, 10);
        }
        map.set(key, (map.get(key) || 0) + 1);
    }

    const result: { fecha: string, cantidad: number }[] = [];
    for (const [fecha, cantidad] of map.entries()) {
        if (cantidad > 0 || this.SEND_ALL) result.push({ fecha, cantidad });
    }

    result.sort((a, b) => a.fecha.localeCompare(b.fecha));
    return result;
}

    async getAlquilerStats(query: EstadisticasDto): Promise<{ fecha: string, cantidad: number }[]> {
        let { fecha_inicio, fecha_fin, tam } = query;

        if (!fecha_inicio) { 
            const primerAlquiler = await this.alquilerRepository.findOne({
                where: {},
                order: { fecha_inicio: 'ASC' },
                select: ['fecha_inicio'],
            })
            fecha_inicio = primerAlquiler ? primerAlquiler.fecha_inicio : new Date('2020-01-01');
        }
        if (!fecha_fin) { fecha_fin = new Date(); }

        const alquileres = await this.alquilerRepository.find({
            where: {
                fecha_inicio: Between(fecha_inicio, fecha_fin)
            },
            select: ['fecha_inicio']
        });
        
        // Grouping logic
        const map = new Map<string, number>();

        for (const alquiler of alquileres) {
            const date = new Date(alquiler.fecha_inicio);
            let key: string;
            if (tam === 'anio') {
                key = date.getFullYear().toString();
            } else if (tam === 'mes') {
                key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            } else {
                key = date.toISOString().slice(0, 10);
            }
            map.set(key, (map.get(key) || 0) + 1);
        }

        const result: { fecha: string, cantidad: number }[] = [];
        for (const [fecha, cantidad] of map.entries()) {
            if (cantidad > 0 || this.SEND_ALL) result.push({ fecha, cantidad });
        }

        result.sort((a, b) => a.fecha.localeCompare(b.fecha));
        return result;
    }

    async getIngresos(query: EstadisticasDto): Promise<{ fecha: string, monto: number }[]> {
        let { fecha_inicio, fecha_fin, tam } = query;

        if (!fecha_inicio) { 
            const primerAlquiler = await this.alquilerRepository.findOne({
                where: {},
                order: { fecha_inicio: 'ASC' },
                select: ['fecha_inicio'],
            })
            fecha_inicio = primerAlquiler ? primerAlquiler.fecha_inicio : new Date('2020-01-01');
        }
        if (!fecha_fin) { fecha_fin = new Date(); }

        const alquileres = await this.alquilerRepository.find({
            where: {
                fecha_inicio: Between(fecha_inicio, fecha_fin)
            },
            select: ['fecha_inicio', 'estado', 'precio']
        });

        // Grouping logic
        const map = new Map<string, number>();

        for (const alquiler of alquileres) {
            const date = new Date(alquiler.fecha_inicio);
            let key: string;
            if (tam === 'anio') {
                key = date.getFullYear().toString();
            } else if (tam === 'mes') {
                key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            } else {
                key = date.toISOString().slice(0, 10);
            }
            map.set(key, (map.get(key) || 0) + alquiler.precio);
        }

        const result: { fecha: string, monto: number }[] = [];
        for (const [fecha, monto] of map.entries()) {
            if (monto > 0 || this.SEND_ALL) result.push({ fecha, monto });
        }

        result.sort((a, b) => a.fecha.localeCompare(b.fecha));
        return result;
    }

}