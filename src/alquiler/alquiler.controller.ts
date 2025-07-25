import { Body, Controller, Get, Param, Patch, Query, Req, UseGuards } from "@nestjs/common";
import { AlquilerService } from "./alquiler.service";
import { ReseñaDto } from "./dto/reseña.dto";
import { RoleGuard } from "src/guards/role.guard";
import { UserRole } from "src/user/user.entity";
import { FilterAlquilerDto } from "./dto/filter-alquiler.dto";

@Controller('alquiler')
export class AlquilerController {
    constructor(private readonly alquilerService: AlquilerService) {}

    @Get()
    @UseGuards(RoleGuard.bind(RoleGuard, [UserRole.Cliente, UserRole.Empleado, UserRole.Admin]))
    async findAlquileres(@Query() filters: FilterAlquilerDto, @Req() req) {
        const user = req.user;
        if (user.rol === UserRole.Cliente) {
            filters.user_email = user.email;
            if (user.id) filters.user_id = user.id;
        }
        return this.alquilerService.findAll(filters, user.rol);
    }

    @Get('estados')
    getStates(): string[] {
        return this.alquilerService.getValidStates(UserRole.Cliente);
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.alquilerService.findOne(id);
    }

    @Patch(':id/confirmar')
    async confirmarAlquiler(@Param('id') id: number, @Body('observacion') observacion?: string) {
        try {
            return await this.alquilerService.confirm(id, observacion);
        } catch (error) {
            return { error: error.message || 'Error al confirmar el alquiler.' };
        }
    }

    @UseGuards(RoleGuard.bind(RoleGuard, [UserRole.Cliente]))
    @Patch(':id/puntuar')
    async reseñarAlquiler(@Param('id') id: number, @Body() reseñaDto: ReseñaDto, @Req() req) {
        const user_id = req.user.id;
        return await this.alquilerService.reseñar(id, reseñaDto, user_id);
    }
}