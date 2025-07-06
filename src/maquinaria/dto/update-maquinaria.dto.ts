import { PartialType } from '@nestjs/mapped-types';
import { MaquinariaDto } from './maquinaria.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateMaquinariaDto extends PartialType(MaquinariaDto) {
  readonly inventario: string;
}

export class UpdateStateDto {
  @IsNotEmpty()
  @IsString()
  estado: string;

  @IsOptional()
  fecha: Date;
}