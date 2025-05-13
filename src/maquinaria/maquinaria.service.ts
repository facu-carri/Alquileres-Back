import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location, Maquinaria, MaquinariaCategory, MaquinariaStates, ReturnPolicy } from './maquinaria.entity';
import { MaquinariaDto } from './dto/maquinaria.dto';
import { UpdateMaquinariaDto } from './dto/update-maquinaria.dto';
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

    async findAll(): Promise<Maquinaria[]> {
        return await this.maquinariaRepository.find();
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

    async remove(id: number): Promise<void> {
        const result = await this.maquinariaRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`No se encontró el maquinaria con id ${id}`);
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

    getAllStates(): string[] {
        return getEnumValues(MaquinariaStates)
    }
}