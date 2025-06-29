import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadisticasService } from './estadisticas.service';
import { EstadisticasController } from './estadisticas.controller';
import { User } from 'src/user/user.entity';
import { Reserva } from 'src/reserva/reserva.entity';
import { Maquinaria } from 'src/maquinaria/maquinaria.entity';
import { Alquiler } from 'src/alquiler/alquiler.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Reserva, Maquinaria, Alquiler]),
    ],
    controllers: [EstadisticasController],
    providers: [EstadisticasService],
    exports: [EstadisticasService]
})
export class EstadisticasModule {}