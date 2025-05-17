import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { RegisterModule } from 'src/register/register.module';

const initializeDB = false

const DatabaseDynamicModule = TypeOrmModule.forRoot({
    type: process.env.DB_TYPE as any,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER_NAME,
    password: process.env.DB_USER_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
        __dirname + '/../**/*.entity{.ts,.js}',
    ],
    synchronize: initializeDB, // Setear en false despues de la primera ejecucion para evitar errores
})

@Module({
    imports: [
        DatabaseDynamicModule,
        ...(initializeDB ? [
            RegisterModule
        ] : [])
    ],
    providers: [
        ...(initializeDB ? [DatabaseService] : [])
    ],
})
export class DatabaseModule {}
