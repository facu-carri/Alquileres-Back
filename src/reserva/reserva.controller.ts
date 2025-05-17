import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { ReservaService } from './reserva.service';

@Controller('reserva')
export class ReservaController {
    constructor(private readonly reservaService: ReservaService) {}

    @Get()
    findAll() {
        return this.reservaService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const reserva = await this.reservaService.findOne(+id);
        if (!reserva) throw new NotFoundException('Reserva not found');
        return reserva;
    }

    @Post()
    create(@Body() createReservaDto: CreateReservaDto) {
        return this.reservaService.create(createReservaDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        const deleted = await this.reservaService.remove(+id);
        if (!deleted) throw new NotFoundException('Reserva not found');
        return { message: `Reserva with id ${id} removed` };
    }
}