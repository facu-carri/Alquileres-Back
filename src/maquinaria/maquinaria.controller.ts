import { Controller, Get, Post, Put, Body, Param, Delete, Patch, Query, UseInterceptors, UploadedFile, Req, UseGuards } from '@nestjs/common';
import { Maquinaria } from './maquinaria.entity';
import { MaquinariaDto } from './dto/maquinaria.dto';
import { FilterMaquinariaDto } from './dto/filter-maquinaria.dto';
import { UpdateMaquinariaDto } from './dto/update-maquinaria.dto';
import { MaquinariaService } from './maquinaria.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { setFilename, setImgOpts, setRoute } from 'src/images/images.module';
import { getImageLink } from 'src/utils/Utils';
import { UserInterceptor } from 'src/interceptors/user-interceptor';
import { RoleGuard } from 'src/guards/role.guard';
import { UserRole } from 'src/user/user.entity';
import { User } from 'mercadopago';

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
    @UseInterceptors(FileInterceptor('image', setImgOpts(setRoute('maquinaria', '{nombre}'), setFilename('foto'))))
    create(
        @Body() maquinariaDto: MaquinariaDto,
        @UploadedFile() image: Express.Multer.File
    ): Promise<Maquinaria> {
        maquinariaDto.imagen = getImageLink(image)
        return this.maquinariaService.create(maquinariaDto);
    }

    @UseGuards(RoleGuard.bind(RoleGuard, [UserRole.Admin]))
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
    @UseInterceptors(UserInterceptor)
    getStates(@Req() req): string[] {
        return this.maquinariaService.getValidStates(req.user.rol)
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Maquinaria> {
        return this.maquinariaService.findOne(id);
    }

    @UseGuards(RoleGuard.bind(RoleGuard, [UserRole.Admin]))
    @Patch(':id/eliminar')
    remove(@Param('id') id: number): Promise<void> {
        return this.maquinariaService.remove(id);
    }
    
    @UseGuards(RoleGuard.bind(RoleGuard, [UserRole.Admin]))
    @Patch(':id/restaurar')
    delete(@Param('id') id: number): Promise<void> {
        return this.maquinariaService.restore(id);
    }

    @UseGuards(RoleGuard.bind(RoleGuard, [UserRole.Admin, UserRole.Empleado]))
    @Patch(':id/esconder')
    hardDelete(@Param('id') id: number): Promise<void> {
        return this.maquinariaService.hide(id);
    }

    @UseGuards(RoleGuard.bind(RoleGuard, [UserRole.Admin, UserRole.Empleado]))
    @Patch(':id/mostrar')
    hide(@Param('id') id: number): Promise<void> {
        return this.maquinariaService.show(id);
    }
}