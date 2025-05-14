import { PartialType } from '@nestjs/mapped-types';
import { MaquinariaDto } from './maquinaria.dto';

export class UpdateMaquinariaDto extends PartialType(MaquinariaDto) {
  // PartialType convierte todos los campos en opcionales
  // State se controla directamente en Logica de Negocio, así que no usa DTO
}