import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MaquinariaModule } from './maquinaria/maquinaria.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { RegisterModule } from './register/register.module';
import { RecoveryModule } from './recovery/recovery.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    MaquinariaModule,
    AuthModule,
    RecoveryModule,
    RegisterModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService
  ],
})
export class AppModule {}
