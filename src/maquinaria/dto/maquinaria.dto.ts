import { IsString, IsNumber, IsNotEmpty, IsEnum, Validator } from 'class-validator';
import { validationMessage, ValidatorTypes } from 'src/utils/ValidatorMessages';
import { MaquinariaStates, ReturnPolicy, MaquinariaCategory, Location } from '../maquinaria.entity';

export class MaquinariaDto {

  @IsString(validationMessage(ValidatorTypes.IsString))
  @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
  readonly nombre: string;

  @IsString(validationMessage(ValidatorTypes.IsString))
  @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
  readonly marca: string;

  @IsString(validationMessage(ValidatorTypes.IsString))
  @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
  readonly modelo: string;

  @IsNumber({}, validationMessage(ValidatorTypes.IsNumber))
  @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
  readonly precio: number;

  @IsNumber({}, validationMessage(ValidatorTypes.IsNumber))
  @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
  readonly año_adquisicion: number;

  @IsEnum(Location, { ...validationMessage(ValidatorTypes.IsEnum), context: { constraints: [Object.values(Location)] } })
  @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
  readonly sucursal: Location;

  @IsEnum(ReturnPolicy, { ...validationMessage(ValidatorTypes.IsEnum), context: { constraints: [Object.values(ReturnPolicy)] } })
  @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
  readonly politica: ReturnPolicy;

  @IsEnum(MaquinariaCategory, { ...validationMessage(ValidatorTypes.IsEnum), context: { constraints: [Object.values(MaquinariaCategory)] } })
  @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
  readonly categoria: MaquinariaCategory;

  // readonly imagen: [TYPE];
  // Asumo que se pasa como base64 o algo por el estilo y se guarda asi en base, o se guarda localmente y se pone en base su ubicacion
}