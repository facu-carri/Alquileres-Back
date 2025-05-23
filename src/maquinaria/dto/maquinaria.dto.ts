import { IsString, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { validationMessage, ValidatorTypes } from 'src/utils/ValidatorMessages';
import { ReturnPolicy, MaquinariaCategory, Location, MaquinariaStates } from '../maquinaria.entity';

export class MaquinariaDto {

  @IsNumber({ allowInfinity: false, allowNaN: false }, validationMessage(ValidatorTypes.IsNumber))
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

  @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
  readonly precio: number;

  @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
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