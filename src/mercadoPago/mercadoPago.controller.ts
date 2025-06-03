import { Controller, Body, Get, Query, Post, Req, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { MercadoPagoService } from './mercadoPago.service';
import { PagoDto } from './dto/pago.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtPayload } from 'src/auth/jwt/jwtPayload';

@Controller('mercadoPago')
export class MercadoPagoController {

    constructor(private readonly mercadoPagoService: MercadoPagoService) {}

    @Get('preferenceId')
    @UseGuards(AuthGuard)
    async getPreferenceId(
        @Req() req,
        @Query() data: PagoDto
    ) {
        const user: JwtPayload = req['user']
        const id = await this.mercadoPagoService.getPreferenceId(data, user.email)
        return { id };
    }

    @Post('notification')
    async notification(
        @Body() body,
        @Req() req
    ) {
        return this.mercadoPagoService.getNotification(body, req.query)
    }
}