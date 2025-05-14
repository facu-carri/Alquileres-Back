import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Filter, Repository } from 'typeorm';
import { Location, Maquinaria, MaquinariaCategory, MaquinariaStates, ReturnPolicy } from './maquinaria.entity';
import { MaquinariaDto } from './dto/maquinaria.dto';
import { UpdateMaquinariaDto } from './dto/update-maquinaria.dto';
import { FilterMaquinariaDto } from './dto/filter-maquinaria.dto';

import { getEnumValues } from 'src/utils/EnumUtils';

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

    async findAll(filters: FilterMaquinariaDto): Promise<Maquinaria[]> {
        const query = this.maquinariaRepository.createQueryBuilder('maquinaria');

        if (filters.text) {
            query.andWhere('maquinaria.nombre LIKE :text', { text: `%${filters.text}%` })
            .orWhere('maquinaria.marca LIKE :text', { text: `%${filters.text}%` })
            .orWhere('maquinaria.modelo LIKE :text', { text: `%${filters.text}%` });
        }
        
        if (filters.nombre) {
            query.andWhere('maquinaria.nombre LIKE :nombre', { nombre: `%${filters.nombre}%` });
        }

        if (filters.marca) {
            query.andWhere('maquinaria.marca LIKE :marca', { marca: `%${filters.marca}%` });
        }

        if (filters.modelo) {
            query.andWhere('maquinaria.modelo LIKE :modelo', { modelo: `%${filters.modelo}%` });
        }

        if (filters.categoria) {
            query.andWhere('maquinaria.categoria = :categoria', { categoria: filters.categoria });
        }
        
        if (filters.state) {
            query.andWhere('maquinaria.state = :state', { state: filters.state });
        }
        
        if (filters.sucursal) {
            query.andWhere('maquinaria.sucursal = :sucursal', { sucursal: filters.sucursal });
        }
        
        if (filters.politica) {
            query.andWhere('maquinaria.politica = :politica', { politica: filters.politica });
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

    async findByCategory(cat: string): Promise<Maquinaria[]> {
        return await this.maquinariaRepository.findBy({ categoria: MaquinariaCategory[cat] });
    }

    async findByState(estado: string): Promise<Maquinaria[]> {
        return await this.maquinariaRepository.findBy({ state: MaquinariaStates[estado] });
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
        return { message: `Maquinaria con id ${id} eliminada con éxito`, }
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
        return { message: `Maquinaria con id ${id} restaurada con éxito`, }
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
        return { message: `Maquinaria con id ${id} se vuelve a mostrar en el listado`, }
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
        return { message: `Maquinaria con id ${id} se ocultó del listado`, }
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

    getAllStates(): string[] {
        return getEnumValues(MaquinariaStates)
    }
}