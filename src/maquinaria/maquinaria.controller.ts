import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { Maquinaria } from './maquinaria.entity';
import { MaquinariaDto } from './dto/maquinaria.dto';
import { MaquinariaService } from './maquinaria.service';

@Controller('maquinaria')
export class MaquinariaController {

    constructor(private readonly maquinariaService: MaquinariaService) {}

    @Get()
    findAll(): Promise<Maquinaria[]> {
        return this.maquinariaService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Maquinaria> {
        return this.maquinariaService.findOne(id);
    }

    @Post()
    create(@Body() maquinariaDto: MaquinariaDto): Promise<Maquinaria> {
        return this.maquinariaService.create(maquinariaDto);
    }
}