import { Controller, Get, Post, Put, Body, Param, Patch, Query, UseInterceptors, UploadedFile, Req, UseGuards, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { Maquinaria } from './maquinaria.entity';
import { MaquinariaDto } from './dto/maquinaria.dto';
import { FilterMaquinariaDto } from './dto/filter-maquinaria.dto';
import { UpdateMaquinariaDto } from './dto/update-maquinaria.dto';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { MaquinariaService } from './maquinaria.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { setFilename, setImgOpts, setRoute } from 'src/files/files.module';
import { generateCode, getImageLink } from 'src/utils/Utils';
import { UserInterceptor } from 'src/interceptors/user-interceptor';
import { RoleGuard } from 'src/guards/role.guard';
import { UserRole } from 'src/user/user.entity';
import { EXT_IMAGES } from 'src/files/extensions';

@Controller('maquinaria')
export class MaquinariaController {

    constructor(private readonly maquinariaService: MaquinariaService) {}

    @Get()
    @UseInterceptors(UserInterceptor)
    findAll(@Query() filters: FilterMaquinariaDto, @Req() req): Promise<Maquinaria[]> {
        return this.maquinariaService.findAll(filters, req.user.rol);
    }

    @Post()
    // Si se redefinen las opciones, se debe volver a setear la ruta usada en el module (en este caso, "maquinaria")
    @UseGuards(RoleGuard.bind(RoleGuard, [UserRole.Admin]))
    @UseInterceptors(FileInterceptor('image',
        setImgOpts(
            {
                exts: EXT_IMAGES,
                msg: 'Formato de imagen invalido'
            },
            setRoute('maquinaria', '{nombre}'),
            setFilename('foto_', generateCode.bind(null, 8))
        )
    ))
    async create(
        @Body() maquinariaDto: MaquinariaDto,
        @UploadedFile() image: Express.Multer.File
    ): Promise<Maquinaria> {
        if (!image) throw new BadRequestException('Falta la imagen')
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

    @UseGuards(RoleGuard.bind(RoleGuard, [UserRole.Admin, UserRole.Empleado]))
    @Patch(':id/estado')
    async changeState(
        @Param('id', ParseIntPipe) id: number,
        @Body('estado') estado: string,
        @Req() req
    ): Promise<any> {
        if (!estado) throw new BadRequestException('Se requiere un estado válido');
        const user = req['user']

        try {
            await this.maquinariaService.changeState(id, estado, req.user);
            return { message: 'Estado actualizado correctamente a ' + estado };
        } catch (error) {
            return { error: error.message || 'Error al actualizar el estado' };
        }
    }
}