import { Controller, Get, Post, Put, Body, Param, Delete, Patch, Query, UseInterceptors, UploadedFile, Req, UseGuards, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { Maquinaria } from './maquinaria.entity';
import { MaquinariaDto } from './dto/maquinaria.dto';
import { FilterMaquinariaDto } from './dto/filter-maquinaria.dto';
import { UpdateMaquinariaDto } from './dto/update-maquinaria.dto';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { MaquinariaService } from './maquinaria.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { setFilename, setImgOpts, setRoute } from 'src/images/images.module';
import { generateCode, getImageLink } from 'src/utils/Utils';
import { UserInterceptor } from 'src/interceptors/user-interceptor';
import { RoleGuard } from 'src/guards/role.guard';
import { UserRole } from 'src/user/user.entity';

@Controller('maquinaria')
export class MaquinariaController {

    constructor(private readonly maquinariaService: MaquinariaService) {}

    @Get()
    @UseInterceptors(UserInterceptor)
    findAll(@Query() filters: FilterMaquinariaDto, @Req() req): Promise<Maquinaria[]> {
        return this.maquinariaService.findAll(filters, req.user);
    }

    @Post()
    // Si se redefinen las opciones, se debe volver a setear la ruta usada en el module (en este caso, "maquinaria")
    @UseGuards(RoleGuard.bind(RoleGuard, [UserRole.Admin]))
    @UseInterceptors(FileInterceptor('image', setImgOpts(setRoute('maquinaria', '{nombre}'), setFilename(`foto_${generateCode(8)}`))))
    async create(
        @Body() maquinariaDto: MaquinariaDto,
        @UploadedFile() image: Express.Multer.File
    ): Promise<Maquinaria> {
        maquinariaDto.imagen = getImageLink(image)
        return await this.maquinariaService.create(maquinariaDto);
    }

    @UseGuards(RoleGuard.bind(RoleGuard, [UserRole.Admin]))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() updatemaquinariaDto: UpdateMaquinariaDto): Promise<Maquinaria> {
        return await this.maquinariaService.update(id, updatemaquinariaDto);
    }

    @Get('/:id/disponibilidad')
    async checkAvailability(@Param('id', ParseIntPipe) id: number, @Query() query: CheckAvailabilityDto): Promise<boolean> {
        return await this.maquinariaService.checkAvailability(id, query.fecha_inicio, query.fecha_fin);
    }

    @Get(':id/fechasOcupadas')
    async getOccupiedDates(@Param('id', ParseIntPipe) id: number): Promise<{ fecha_inicio: string, fecha_fin: string }[]> {
        return await this.maquinariaService.getOccupiedDates(id);
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
    @UseInterceptors(UserInterceptor)
    getStates(@Req() req): string[] {
        return this.maquinariaService.getValidStates(req.user.rol)
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Maquinaria> {
        return await this.maquinariaService.findOne(id);
    }

    @UseGuards(RoleGuard.bind(RoleGuard, [UserRole.Admin]))
    @Patch(':id/eliminar')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return await this.maquinariaService.remove(id);
    }
    
    @UseGuards(RoleGuard.bind(RoleGuard, [UserRole.Admin]))
    @Patch(':id/restaurar')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return await this.maquinariaService.restore(id);
    }

    @UseGuards(RoleGuard.bind(RoleGuard, [UserRole.Admin, UserRole.Empleado]))
    @Patch(':id/esconder')
    async hardDelete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return await this.maquinariaService.hide(id);
    }

    @UseGuards(RoleGuard.bind(RoleGuard, [UserRole.Admin, UserRole.Empleado]))
    @Patch(':id/mostrar')
    async hide(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return await this.maquinariaService.show(id);
    }
}