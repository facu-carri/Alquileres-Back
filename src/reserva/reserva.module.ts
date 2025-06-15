import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './reserva.entity';
import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';
import { Maquinaria } from 'src/maquinaria/maquinaria.entity';
import { User } from 'src/user/user.entity';
import { Alquiler } from 'src/alquiler/alquiler.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Reserva, Maquinaria, User, Alquiler])],
    controllers: [ReservaController],
    providers: [ReservaService],
    exports: [ReservaService]
})
export class ReservaModule {}
