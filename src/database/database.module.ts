import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { RegisterModule } from 'src/register/register.module';

const initializeDB = false

const DatabaseDynamicModule = TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    // para MongoDB
    // type: 'mongodb',
    // host: 'localhost',
    // port: 27017,
    username: 'root',
    password: process.env.DB_PASSWORD,
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
