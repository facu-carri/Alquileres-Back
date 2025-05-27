import { Controller, Body, Get, Query, Post } from '@nestjs/common';
import { MercadoPagoService } from './mercadoPago.service';
import { PagoDto } from './dto/pago.dto';

@Controller('mercadoPago')
export class MercadoPagoController {

    constructor(private readonly mercadoPagoService: MercadoPagoService) {}

    @Get('preferenceId')
    async getPreferenceId(@Query() data: PagoDto) {
        const id = await this.mercadoPagoService.getPreferenceId(data)
        return { id };
    }

    @Post('notification')
    async notification(@Body() body) {
        return this.mercadoPagoService.getNotification(body)
    }
}