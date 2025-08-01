import { Controller, Get, Post, Param, Body, NotFoundException, UseGuards, Patch, ParseIntPipe, UseInterceptors, Req, Query } from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { ReservaService } from './reserva.service';
import { UserRole } from 'src/user/user.entity';
import { RoleGuard } from 'src/guards/role.guard';
import { FilterReservaDto } from './dto/filter-reserva.dto';
import { UserInterceptor } from 'src/interceptors/user-interceptor';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('reserva')
export class ReservaController {
    constructor(private readonly reservaService: ReservaService) {}

    @Get()
    @UseGuards(RoleGuard.bind(RoleGuard, [UserRole.Cliente, UserRole.Empleado, UserRole.Admin]))
    async findReservas(@Query() filters: FilterReservaDto, @Req() req) {
        const user = req.user;
        if (user.rol === UserRole.Cliente) {
            filters.user_email = user.email;
            if (user.id) filters.user_id = user.id;
        }
        return this.reservaService.findAll(filters, user.rol);
    }

    @Get('estados')
    @UseInterceptors(UserInterceptor)
    getStates(@Req() req): string[] {
        return this.reservaService.getValidStates(req.user.rol)
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const reserva = await this.reservaService.findOne(+id);
        if (!reserva) throw new NotFoundException('Reserva not found');
        return reserva;
    }
    
    @UseGuards(RoleGuard.bind(RoleGuard, [UserRole.Empleado]))
    @Patch(':id/confirmar')
    async confirmarReserva(@Param('id', ParseIntPipe) id: number) {
        return await this.reservaService.confirmarReserva(id);
    }

    @UseGuards(RoleGuard.bind(RoleGuard, [UserRole.Cliente, UserRole.Empleado, UserRole.Admin]))
    @Patch(':id/cancelar')
    async cancelarReserva(@Param('id', ParseIntPipe) id: number, @Req() req) {
        const user = req.user;
        if (!user) return { error: 'User not found' };

        return await this.reservaService.cancelarReserva(id, user);
    }

    @Post()
    @UseGuards(AuthGuard)
    async create(@Body() createReservaDto: CreateReservaDto) {
        return await this.reservaService.create(createReservaDto);
    }
}