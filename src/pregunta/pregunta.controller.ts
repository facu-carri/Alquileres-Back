import { Controller, Get, Param, Patch, Body, NotFoundException, UseGuards } from '@nestjs/common';
import { PreguntaService } from './pregunta.service';
import { RoleGuard } from 'src/guards/role.guard';
import { UserRole } from 'src/user/user.entity';

@Controller('pregunta')
export class PreguntaController {
    constructor(private readonly preguntaService: PreguntaService) {}

    // @UseGuards(RoleGuard.bind(RoleGuard, [UserRole.Empleado, UserRole.Admin]))
    @Get()
    async findAll() {
        return this.preguntaService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        const pregunta = await this.preguntaService.findOne(id);
        if (!pregunta) throw new NotFoundException('Pregunta not found');
        return pregunta;
    }

    @UseGuards(RoleGuard.bind(RoleGuard, [UserRole.Empleado, UserRole.Admin]))
    @Patch(':id/responder')
    async answer(
        @Param('id') id: number,
        @Body('respuesta') respuesta: string
    ) {
        return this.preguntaService.answer(id, respuesta);
    }

    @UseGuards(RoleGuard.bind(RoleGuard, [UserRole.Empleado, UserRole.Admin]))
    @Patch(':id/eliminar')
    async remove(@Param('id') id: number) {
        await this.preguntaService.remove(id);
        return { message: 'Pregunta eliminada correctamente' };
    }
}