import { Controller, Get, Post, Put, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { Maquinaria } from './maquinaria.entity';
import { MaquinariaDto } from './dto/maquinaria.dto';
import { FilterMaquinariaDto } from './dto/filter-maquinaria.dto';
import { UpdateMaquinariaDto } from './dto/update-maquinaria.dto';
import { MaquinariaService } from './maquinaria.service';

@Controller('maquinaria')
export class MaquinariaController {

    constructor(private readonly maquinariaService: MaquinariaService) {}

    @Get()
    findAll(@Query() filters: FilterMaquinariaDto): Promise<Maquinaria[]> {
        // for each field in filters, if the field is empty, remove it
        console.log (filters);
        Object.keys(filters).forEach(key => {
            if (filters[key] === '' || filters[key] === null) {
                delete filters[key];
            }
        })
        return this.maquinariaService.findAll(filters);
    }

    @Post()
    create(@Body() maquinariaDto: MaquinariaDto): Promise<Maquinaria> {
        return this.maquinariaService.create(maquinariaDto);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() updatemaquinariaDto: UpdateMaquinariaDto): Promise<Maquinaria> {
        return this.maquinariaService.update(id, updatemaquinariaDto);
    }

    @Get('/estados/:estado')
    findByState(@Param('estado') estado: string): Promise<Maquinaria[]> {
        return this.maquinariaService.findByState(estado);
    }

    @Get('/categorias/:categoria')
    findByCategory(@Param('categoria') categoria: string): Promise<Maquinaria[]> {
        return this.maquinariaService.findByCategory(categoria);
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

    @Patch(':id/eliminar')
    remove(@Param('id') id: number): Promise<void> {
        return this.maquinariaService.remove(id);
    }
    
    @Patch(':id/restaurar')
    delete(@Param('id') id: number): Promise<void> {
        return this.maquinariaService.restore(id);
    }

    @Patch(':id/esconder')
    hardDelete(@Param('id') id: number): Promise<void> {
        return this.maquinariaService.hide(id);
    }

    @Patch(':id/mostrar')
    hide(@Param('id') id: number): Promise<void> {
        return this.maquinariaService.show(id);
    }
}