import { Controller, Body, Get, Query, ParseIntPipe, ParseFloatPipe } from '@nestjs/common';
import { MercadoPagoService } from './mercadoPago.service';
import { PagoDto } from './dto/pago.dto';
import { response } from 'express';

@Controller('mercadoPago')
export class MercadoPagoController {

    constructor(private readonly mercadoPagoService: MercadoPagoService) {}

    @Get('preferenceId')
    async getPreferenceId(@Query() data: PagoDto) {
        const id = await this.mercadoPagoService.getPreferenceId(data)
        return { id };
    }
}