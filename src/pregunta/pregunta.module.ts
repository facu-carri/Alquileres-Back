import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Pregunta } from "./pregunta.entity";
import { PreguntaService } from "./pregunta.service";

@Module({
  imports: [TypeOrmModule.forFeature([Pregunta])],
  providers: [PreguntaService],
  exports: [PreguntaService],
})
export class PreguntaModule {}