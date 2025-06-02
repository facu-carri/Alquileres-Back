import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Maquinaria } from './maquinaria.entity';
import { Reserva } from 'src/reserva/reserva.entity';
import { MaquinariaService } from './maquinaria.service';
import { MaquinariaController } from './maquinaria.controller';
import { FilesModuleByRoute } from 'src/files/files.module';
import { ReservaService } from 'src/reserva/reserva.service';
import { User } from 'src/user/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Maquinaria, Reserva, User]), FilesModuleByRoute('maquinaria')],
    controllers: [MaquinariaController],
    providers: [MaquinariaService, ReservaService],
    exports: [MaquinariaService]
})
export class MaquinariaModule {}
