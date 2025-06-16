import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Maquinaria } from './maquinaria.entity';
import { Reserva } from 'src/reserva/reserva.entity';
import { MaquinariaService } from './maquinaria.service';
import { MaquinariaController } from './maquinaria.controller';
import { FilesModuleByRoute } from 'src/files/files.module';
import { ReservaModule } from 'src/reserva/reserva.module';
import { Pregunta } from 'src/pregunta/pregunta.entity';
import { PreguntaModule } from 'src/pregunta/pregunta.module';

@Module({
    imports: [ReservaModule, TypeOrmModule.forFeature([Maquinaria, Reserva, Pregunta]), FilesModuleByRoute('maquinaria'), PreguntaModule],
    controllers: [MaquinariaController],
    providers: [MaquinariaService],
    exports: [MaquinariaService]
})
export class MaquinariaModule {}
