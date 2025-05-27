import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { MercadoPagoController } from './mercadoPago.controller';
import { MercadoPagoService } from './mercadoPago.service';

@Module({
    imports: [UserModule],
    controllers: [MercadoPagoController],
    providers: [MercadoPagoService],
    exports: [MercadoPagoService]
})
export class MercadoPagoModule {}
