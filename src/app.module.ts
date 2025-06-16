import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MaquinariaModule } from './maquinaria/maquinaria.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { RegisterModule } from './register/register.module';
import { RecoveryModule } from './recovery/recovery.module';
import { ImagesController } from './files/images.controller';
import { ReservaModule } from 'src/reserva/reserva.module';
import { MercadoPagoModule } from './mercadoPago/mercadoPago.module';
import { PreguntaModule } from './pregunta/pregunta.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    MaquinariaModule,
    ReservaModule,
    AuthModule,
    RecoveryModule,
    RegisterModule,
    MercadoPagoModule,
    PreguntaModule
  ],
  controllers: [
    AppController,
    ImagesController
  ],
  providers: [
    AppService
  ],
})
export class AppModule {}
