import { Module } from '@nestjs/common';
import { MercadoPagoController } from './mercadoPago.controller';
import { MercadoPagoService } from './mercadoPago.service';
import { MaquinariaModule } from 'src/maquinaria/maquinaria.module';
import { ReservaModule } from 'src/reserva/reserva.module';

@Module({
    imports: [ReservaModule, MaquinariaModule],
    controllers: [MercadoPagoController],
    providers: [MercadoPagoService],
    exports: [MercadoPagoService]
})
export class MercadoPagoModule {}
