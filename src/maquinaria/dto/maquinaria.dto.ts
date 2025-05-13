import { IsString, IsNumber, IsNotEmpty, Validator } from 'class-validator';
import { validationMessage, ValidatorTypes } from 'src/utils/ValidatorMessages';

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

  // Ver cómo mapear la elección al tipo de dato. Comentado para que compile

  // @IsString(validationMessage(ValidatorTypes.IsString))
  // @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
  // readonly sucursal: string;

  // @IsString(validationMessage(ValidatorTypes.IsString))
  // @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
  // readonly politica: string;

  // @IsString(validationMessage(ValidatorTypes.IsString))
  // @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
  // readonly categoria: string;

  // readonly imagen: [TYPE];
  // Asumo que se pasa como base64 o algo por el estilo y se guarda asi en base, o se guarda localmente y se pone en base su ubicacion
}