import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskController } from './task/task.controller';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
          __dirname + '/../**/*.entity{.ts,.js}',
      ],
      synchronize: true, // Setear en false despues de la primera ejecucion para evitar errores
    }),
    UsersModule
  ],
  controllers: [
    AppController,
    TaskController
  ],
  providers: [
    AppService
  ],
})
export class AppModule {}
