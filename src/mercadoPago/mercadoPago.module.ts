import { Module } from '@nestjs/common';
import { MercadoPagoController } from './mercadoPago.controller';
import { MercadoPagoService } from './mercadoPago.service';
import { MaquinariaModule } from 'src/maquinaria/maquinaria.module';

@Module({
    imports: [MaquinariaModule],
    controllers: [MercadoPagoController],
    providers: [MercadoPagoService],
    exports: [MercadoPagoService]
})
export class MercadoPagoModule {}
