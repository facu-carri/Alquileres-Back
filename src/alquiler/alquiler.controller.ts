import { Body, Controller, Get, Param, Patch, Req, UseGuards } from "@nestjs/common";
import { AlquilerService } from "./alquiler.service";
import { ReseñaDto } from "./dto/reseña.dto";
import { RoleGuard } from "src/guards/role.guard";
import { UserRole } from "src/user/user.entity";

@Controller('alquiler')
export class AlquilerController {
    constructor(private readonly alquilerService: AlquilerService) {}

    @Get()
    async findAll() {
        return this.alquilerService.findAll();
    }

    @Get('estados')
    getStates(): string[] {
        return this.alquilerService.getValidStates();
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
    @Patch(':id/reseñar')
    async reseñarAlquiler(@Param('id') id: number, @Body() reseñaDto: ReseñaDto, @Req() req) {
        try {
            const user_id = req.user.id;
            return await this.alquilerService.reseñar(id, reseñaDto, user_id);
        } catch (error) {
            return { error: error.message || 'Error al reseñar el alquiler.' };
        }
    }
}