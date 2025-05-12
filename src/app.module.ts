import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/client/user.module';
import { ItemModule } from './items/item.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { RegisterModule } from './register/register.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    ItemModule,
    AuthModule,
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
