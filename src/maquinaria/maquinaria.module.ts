import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Maquinaria } from './maquinaria.entity';
import { MaquinariaService } from './maquinaria.service';
import { MaquinariaController } from './maquinaria.controller';
import { ImagesModule, ImagesModuleByRoute } from 'src/images/images.module';

@Module({
    imports: [TypeOrmModule.forFeature([Maquinaria]), ImagesModuleByRoute('maquinaria')],
    controllers: [MaquinariaController],
    providers: [MaquinariaService],
    exports: [MaquinariaService]
})
export class MaquinariaModule {}
