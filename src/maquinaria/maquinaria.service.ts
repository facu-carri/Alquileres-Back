import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Filter, Repository } from 'typeorm';
import { Location, Maquinaria, MaquinariaCategory, MaquinariaStates, ReturnPolicy } from './maquinaria.entity';
import { MaquinariaDto } from './dto/maquinaria.dto';
import { UpdateMaquinariaDto } from './dto/update-maquinaria.dto';
import { FilterMaquinariaDto } from './dto/filter-maquinaria.dto';

import { getEnumValues } from 'src/utils/EnumUtils';
import { response } from 'express';
import { UserRole } from 'src/user/user.entity';

@Injectable()
export class MaquinariaService {
    
    constructor(
        @InjectRepository(Maquinaria)
        private readonly maquinariaRepository: Repository<Maquinaria>,
    ) {}

    async create(maquinariaDto: MaquinariaDto): Promise<Maquinaria> {
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
            query.andWhere('maquinaria.nombre LIKE :text', { text: `%${filters.text}%` })
            .orWhere('maquinaria.marca LIKE :text', { text: `%${filters.text}%` })
            .orWhere('maquinaria.modelo LIKE :text', { text: `%${filters.text}%` });
        }

        for (let filter of filterNames) {
            const useLike = filter.includes('like_')
            if(useLike) filter = filter.substring(5)
            if (filters[filter]) query.andWhere(`maquinaria.${filter} ${useLike ? 'LIKE' : '='} :${filter}`, { [filter]: `%${filters[filter]}%` });
        }
        
        return query.getMany();
    }

    async findOne(id: number): Promise<Maquinaria> {
        const maquinaria = await this.maquinariaRepository.findOneBy({ id });
        if (!maquinaria) {
            throw new NotFoundException(`No se encontró la maquinaria con id ${id}`);
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