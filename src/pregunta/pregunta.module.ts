import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Pregunta } from "./pregunta.entity";
import { PreguntaService } from "./pregunta.service";
import { PreguntaController } from "./pregunta.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Pregunta])],
  controllers: [PreguntaController],
  providers: [PreguntaService],
  exports: [PreguntaService],
})
export class PreguntaModule {}