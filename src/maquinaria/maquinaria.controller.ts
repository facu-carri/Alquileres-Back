import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { Maquinaria } from './maquinaria.entity';
import { MaquinariaDto } from './dto/maquinaria.dto';
import { MaquinariaService } from './maquinaria.service';

@Controller('maquinaria')
export class MaquinariaController {

    constructor(private readonly itemsService: MaquinariaService) {}

    @Get()
    findAll(): Promise<Maquinaria[]> {
        return this.itemsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Maquinaria> {
        return this.itemsService.findOne(id);
    }

    @Post()
    create(@Body() itemDto: MaquinariaDto): Promise<Maquinaria> {
        return this.itemsService.create(itemDto);
    }
}