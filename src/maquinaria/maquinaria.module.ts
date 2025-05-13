import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Maquinaria } from './maquinaria.entity';
import { MaquinariaService } from './maquinaria.service';
import { MaquinariaController } from './maquinaria.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Maquinaria])],
    controllers: [MaquinariaController],
    providers: [MaquinariaService],
    exports: [MaquinariaService]
})
export class MaquinariaModule {}
