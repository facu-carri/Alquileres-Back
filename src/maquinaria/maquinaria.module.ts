import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Maquinaria } from './maquinaria.entity';
import { Reserva } from 'src/reserva/reserva.entity';
import { MaquinariaService } from './maquinaria.service';
import { MaquinariaController } from './maquinaria.controller';
import { FilesModuleByRoute } from 'src/files/files.module';
import { ReservaModule } from 'src/reserva/reserva.module';

@Module({
    imports: [ReservaModule, TypeOrmModule.forFeature([Maquinaria, Reserva]), FilesModuleByRoute('maquinaria')],
    controllers: [MaquinariaController],
    providers: [MaquinariaService],
    exports: [MaquinariaService]
})
export class MaquinariaModule {}
