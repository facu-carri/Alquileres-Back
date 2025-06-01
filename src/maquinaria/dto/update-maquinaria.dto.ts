import { PartialType } from '@nestjs/mapped-types';
import { MaquinariaDto } from './maquinaria.dto';

export class UpdateMaquinariaDto extends PartialType(MaquinariaDto) {
  readonly inventario: string;
}