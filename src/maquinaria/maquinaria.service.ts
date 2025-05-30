import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Filter, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Location, Maquinaria, MaquinariaCategory, MaquinariaStates, ReturnPolicy } from './maquinaria.entity';
import { MaquinariaDto } from './dto/maquinaria.dto';
import { UpdateMaquinariaDto } from './dto/update-maquinaria.dto';
import { FilterMaquinariaDto } from './dto/filter-maquinaria.dto';
import { Reserva, ReservaStates } from 'src/reserva/reserva.entity';

import { getEnumValues } from 'src/utils/EnumUtils';
import { response } from 'express';
import { UserRole } from 'src/user/user.entity';

@Injectable()
export class MaquinariaService {
    
    constructor(
        @InjectRepository(Maquinaria)
        private readonly maquinariaRepository: Repository<Maquinaria>,
        @InjectRepository(Reserva)
        private readonly reservaRepository: Repository<Reserva>,
    ) {}

    async create(maquinariaDto: MaquinariaDto): Promise<Maquinaria> {
        const invExist = await this.maquinariaRepository.findOneBy({ inventario: maquinariaDto.inventario });
        if(invExist) throw new BadRequestException('El numero de inventario ya se encuentra registrado')
        
        const maquinaria = this.maquinariaRepository.create(maquinariaDto);
        return await this.maquinariaRepository.save(maquinaria);
    }

    async findAll(filters: FilterMaquinariaDto, rol: UserRole): Promise<Maquinaria[]> {
        const filterNames = ['like_nombre', 'like_marca', 'like_modelo', 'categoria', 'sucursal', 'politica']
        const query = this.maquinariaRepository.createQueryBuilder('maquinaria');
        const validStates = this.getValidStates(rol)
        
        if(filters.state && validStates.includes(filters.state)) filterNames.push('state')
        else query.andWhere('maquinaria.state IN (:...states)', { states: validStates });
        
        if (filters.text) {
            query.andWhere(
                new Brackets(qb => {
                    qb.where('maquinaria.nombre LIKE :text', { text: `%${filters.text}%` })
                    .orWhere('maquinaria.marca LIKE :text', { text: `%${filters.text}%` })
                    .orWhere('maquinaria.modelo LIKE :text', { text: `%${filters.text}%` });
                })
            );
        }

        for (let filter of filterNames) {
            const useLike = filter.startsWith('like_');
            const field = useLike ? filter.replace(/^like_/, '') : filter;
            const value = filters[field];
            if (value !== undefined && value !== null && value !== '') {
                if (useLike) {
                    query.andWhere(`maquinaria.${field} LIKE :${field}`, { [field]: `%${value}%` });
                } else {
                    query.andWhere(`maquinaria.${field} = :${field}`, { [field]: value });
                }
            }
        }

        if (filters.fecha_inicio && filters.fecha_fin) {
            const fechaInicio = new Date(filters.fecha_inicio);
            const fechaFin = new Date(filters.fecha_fin);

            fechaInicio.setDate(fechaInicio.getDate() - 3);
            fechaFin.setDate(fechaFin.getDate() + 3);

            query.andWhere(qb => {
                const subQuery = qb.subQuery()
                    .select('1')
                    .from(Reserva, 'reserva')
                    .where('reserva.id_maquinaria = maquinaria.id')
                    .andWhere('reserva.fecha_inicio <= :fechaFin')
                    .andWhere('reserva.fecha_fin >= :fechaInicio')
                    .getQuery();
                return `NOT EXISTS ${subQuery}`;
            }, { fechaInicio: fechaInicio.toISOString(), fechaFin: fechaFin.toISOString() });
        }
        
        return query.getMany();
    }

    async checkAvailability(id: number, fecha_inicio: Date, fecha_fin: Date): Promise<boolean> {
        const maquinaria = await this.maquinariaRepository.findOneBy({ id });
        if (!maquinaria) {
            throw new NotFoundException(`No se encontró la maquinaria con id ${id}`);
        }
        if (maquinaria.state !== MaquinariaStates.Disponible) {
            throw new BadRequestException(`La maquinaria con id ${id} no está Disponible`);
        }

        // Validar fechas
        if (fecha_inicio >= fecha_fin) {
            throw new BadRequestException('La fecha de inicio debe ser menor que la fecha de fin');
        }

        // Logica de negocio: 3 dias de diferencia
        const bufferInicio = new Date(fecha_inicio);
        bufferInicio.setDate(bufferInicio.getDate() - 3);

        const bufferFin = new Date(fecha_fin);
        bufferFin.setDate(bufferFin.getDate() + 3);

        // Implementar lógica para verificar disponibilidad
        const reservas = await this.reservaRepository.find({
            where: {
                maquinaria: { id },
                fecha_inicio: LessThanOrEqual(bufferFin),
                fecha_fin: MoreThanOrEqual(bufferInicio),
            },
        });
        return reservas.length === 0;
    }

    async getOccupiedDates(id: number): Promise<{ fecha_inicio: string, fecha_fin: string }[]> {
        const maquinaria = await this.maquinariaRepository.findOneBy({ id });
        if (!maquinaria) {
            throw new NotFoundException(`No se encontró la maquinaria con id ${id}`);
        }
        if (maquinaria.state !== MaquinariaStates.Disponible) {
            throw new BadRequestException(`La maquinaria con id ${id} no está Disponible`);
        }
        const reservas = await this.reservaRepository.find({
            where: {
                maquinaria: { id },
                estado: ReservaStates.Activa,
            },
        });
        
        return reservas.map((reserva) => {
            const fecha_inicio = new Date(reserva.fecha_inicio);
            fecha_inicio.setDate(fecha_inicio.getDate() - 3);

            const fecha_fin = new Date(reserva.fecha_fin);
            fecha_fin.setDate(fecha_fin.getDate() + 3);

            return {
            fecha_inicio: fecha_inicio.toISOString(),
            fecha_fin: fecha_fin.toISOString(),
            };
        });
    }

    async findOne(id: number): Promise<Maquinaria> {
        const maquinaria = await this.maquinariaRepository.findOneBy({ id });
        if (!maquinaria) {
            throw new NotFoundException(`No se encontró la maquinaria con id ${id}`);
        }
        return maquinaria;
    }

    async findByInventario(inventario: string): Promise<Maquinaria> {
        const maquinaria = await this.maquinariaRepository.findOneBy({ inventario });
        if (!maquinaria) {
            throw new NotFoundException(`No se encontró la maquinaria con inventario ${inventario}`);
        }
        return maquinaria;
    }

    async update(id: number, updatemaquinariaDto: UpdateMaquinariaDto): Promise<Maquinaria> {
        const maquinaria = await this.findOne(id);
        this.maquinariaRepository.merge(maquinaria, updatemaquinariaDto);
        return await this.maquinariaRepository.save(maquinaria);
    }

    async remove(id: number): Promise<any> {
        const item = await this.findOne(id);
        if (!item) {
            throw new NotFoundException(`No se encontró la maquinaria con id ${id}`);
        }
        if (item.state === MaquinariaStates.Eliminado) {
            throw new BadRequestException(`La maquinaria con id ${id} ya se encuentra eliminada`);
        }
        item.state = MaquinariaStates.Eliminado;
        await this.maquinariaRepository.save(item);
        return response.status(200)
    }

    async restore(id: number): Promise<any> {
        const item = await this.findOne(id);
        if (!item) {
            throw new NotFoundException(`No se encontró la maquinaria con id ${id}`);
        }
        if (item.state !== MaquinariaStates.Eliminado) {
            throw new BadRequestException(`La maquinaria con id ${id} no se encuentra eliminada`);
        }
        item.state = MaquinariaStates.Disponible;
        await this.maquinariaRepository.save(item);
        return response.status(200)
    }

    async show(id: number): Promise<any> {
        const item = await this.findOne(id);
        if (!item) {
            throw new NotFoundException(`No se encontró la maquinaria con id ${id}`);
        }
        if (item.state !== MaquinariaStates.Mantenimiento) {
            throw new BadRequestException(`La maquinaria con id ${id} no se encuentra en mantenimiento`);
        }
        item.state = MaquinariaStates.Disponible;
        await this.maquinariaRepository.save(item);
        return response.status(200)
    }

    async hide(id: number): Promise<any> {
        const item = await this.findOne(id);
        if (!item) {
            throw new NotFoundException(`No se encontró la maquinaria con id ${id}`);
        }
        if (item.state !== MaquinariaStates.Disponible) {
            throw new BadRequestException(`La maquinaria con id ${id} no está disponible`);
        }
        item.state = MaquinariaStates.Mantenimiento;
        await this.maquinariaRepository.save(item);
        return response.status(200)
    }

    async changeState(id: number, state: string, rol: UserRole): Promise<Maquinaria> {
        const maquinaria = await this.findOne(id);
        if (!maquinaria) {
            throw new NotFoundException(`No se encontró la maquinaria con id ${id}`);
        }

        const validStates = this.getValidStates(rol);
        if (!validStates.includes(state as MaquinariaStates)) {
            throw new BadRequestException(`El estado ${state} no es válido para el rol ${rol}`);
        }

        maquinaria.state = state as MaquinariaStates;

        if (maquinaria.state !== MaquinariaStates.Disponible) {
            const reservas = await this.reservaRepository.find({
                where: {
                    maquinaria: { id },
                    estado: ReservaStates.Activa,
                },
            });
        if (reservas.length > 0) {
            throw new BadRequestException(`No se puede cambiar el estado de la maquinaria porque tiene reservas activas`);
        }
        return await this.maquinariaRepository.save(maquinaria);
        }
    }


    getAllCategories(): string[] {
        return getEnumValues(MaquinariaCategory)
    }

    getAllPolitics(): string[] {
        return getEnumValues(ReturnPolicy)
    }

    getAllLocations(): string[] {
        return getEnumValues(Location)
    }

    getValidStates(rol: UserRole): string[] {
        const states = getEnumValues(MaquinariaStates)

        // temp
        // return states
        
        if (rol == UserRole.Admin) return states

        const e_index = states.indexOf(MaquinariaStates.Eliminado)
        states.splice(e_index, 1)

        if (rol !== UserRole.Empleado) {
            const m_index = states.indexOf(MaquinariaStates.Mantenimiento)
            states.splice(m_index, 1)
        }
        
        return states
    }
}