import { IsString, IsNotEmpty, IsEnum, IsNumber, Min, IsAlphanumeric, MinLength } from 'class-validator';
import { validationMessage, ValidatorTypes } from 'src/utils/ValidatorMessages';
import { ReturnPolicy, MaquinariaCategory, Location, MaquinariaStates } from '../maquinaria.entity';

export class MaquinariaDto {

  @IsAlphanumeric(null, validationMessage(ValidatorTypes.IsAlphaNumeric))
  @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
  readonly inventario: number;

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

  @IsEnum(Location, { ...validationMessage(ValidatorTypes.IsEnum), context: { constraints: [Object.values(Location)] } })
  @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
  readonly sucursal: Location;

  @IsEnum(ReturnPolicy, { ...validationMessage(ValidatorTypes.IsEnum), context: { constraints: [Object.values(ReturnPolicy)] } })
  @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
  readonly politica: ReturnPolicy;

  @IsEnum(MaquinariaCategory, { ...validationMessage(ValidatorTypes.IsEnum), context: { constraints: [Object.values(MaquinariaCategory)] } })
  @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
  readonly categoria: MaquinariaCategory;

  imagen: string
  state?: MaquinariaStates
}