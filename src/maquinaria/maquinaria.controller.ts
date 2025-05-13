import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { Maquinaria } from './maquinaria.entity';
import { MaquinariaDto } from './dto/maquinaria.dto';
import { UpdateMaquinariaDto } from './dto/update-maquinaria.dto';
import { MaquinariaService } from './maquinaria.service';

@Controller('maquinaria')
export class MaquinariaController {

    constructor(private readonly maquinariaService: MaquinariaService) {}

    @Get()
    findAll(): Promise<Maquinaria[]> {
        return this.maquinariaService.findAll();
    }

    @Post()
    create(@Body() maquinariaDto: MaquinariaDto): Promise<Maquinaria> {
        return this.maquinariaService.create(maquinariaDto);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() updatemaquinariaDto: UpdateMaquinariaDto): Promise<Maquinaria> {
        return this.maquinariaService.update(id, updatemaquinariaDto);
    }

    @Get('categorias')
    getCategories(): string[] {
        return this.maquinariaService.getAllCategories()
    }

    @Get('politicas')
    getPolitics(): string[] {
        return this.maquinariaService.getAllPolitics()
    }

    @Get('sucursales')
    getLocations(): string[] {
        return this.maquinariaService.getAllLocations()
    }

    @Get('estados')
    getStates(): string[] {
        return this.maquinariaService.getAllStates()
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Maquinaria> {
        return this.maquinariaService.findOne(id);
    }
}