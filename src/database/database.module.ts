import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { RegisterModule } from 'src/register/register.module';
import { MaquinariaModule } from 'src/maquinaria/maquinaria.module';
import { ReservaModule } from 'src/reserva/reserva.module';
import { UserModule } from 'src/user/user.module';
import { AlquilerModule } from 'src/alquiler/alquiler.module';
import { PreguntaModule } from 'src/pregunta/pregunta.module';

const initializeDB = true

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
    dropSchema: initializeDB
})

@Module({
    imports: [
        DatabaseDynamicModule,
        ...(initializeDB ? [
            RegisterModule,
            MaquinariaModule,
            ReservaModule,
            UserModule,
            AlquilerModule,
            PreguntaModule,
        ] : [])
    ],
    providers: [
        ...(initializeDB ? [DatabaseService] : [])
    ],
})
export class DatabaseModule {}
