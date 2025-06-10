import { IsString, IsNotEmpty, IsEnum, IsNumber, Min } from 'class-validator';
import { validationMessage, ValidatorTypes } from 'src/utils/ValidatorMessages';
import { MaquinariaStates } from '../maquinaria.entity';
import { Categoria } from "src/utils/enums";
import { Sucursal } from "src/utils/enums";
import { Politica } from "src/utils/enums";
import { Transform } from 'class-transformer';

export class MaquinariaDto {

  @Transform(({ value }) => value !== undefined && value !== null ? String(value) : value)
  @IsString(validationMessage(ValidatorTypes.IsString))
  @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
  readonly inventario: string;

  @IsString(validationMessage(ValidatorTypes.IsString))
  @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
  readonly nombre: string;

  @IsString(validationMessage(ValidatorTypes.IsString))
  @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
  readonly marca: string;

  @IsString(validationMessage(ValidatorTypes.IsString))
  @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
  readonly modelo: string;

  @IsNumber({ allowInfinity: false, allowNaN: false }, validationMessage(ValidatorTypes.IsNumber))
  @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
  @Min(1, { message: 'El precio debe ser un número mayor a 0' })
  readonly precio: number;

  @IsNumber({ allowInfinity: false, allowNaN: false }, validationMessage(ValidatorTypes.IsNumber))
  @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
  @Min(1, { message: 'El año de adquisición debe ser un número mayor a 0' })
  readonly anio_adquisicion: number;

  @IsEnum(Sucursal, { ...validationMessage(ValidatorTypes.IsEnum), context: { constraints: [Object.values(Sucursal)] } })
  @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
  readonly sucursal: Sucursal;

  @IsEnum(Politica, { ...validationMessage(ValidatorTypes.IsEnum), context: { constraints: [Object.values(Politica)] } })
  @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
  readonly politica: Politica;

  @IsEnum(Categoria, { ...validationMessage(ValidatorTypes.IsEnum), context: { constraints: [Object.values(Categoria)] } })
  @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
  readonly categoria: Categoria;

  imagen: string
  state?: MaquinariaStates
}