import { IsString, IsEmail, IsNotEmpty, MinLength, Validator } from 'class-validator';
import { validationMessage, ValidatorTypes } from 'src/utils/ValidatorMessages';

export class ClientDto {
  @IsString(validationMessage(ValidatorTypes.IsString))
  @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
  readonly nombre: string;

  @IsString(validationMessage(ValidatorTypes.IsString))
  @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
  readonly apellido: string;

  @IsString(validationMessage(ValidatorTypes.IsString))
  @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
  @IsEmail({}, validationMessage(ValidatorTypes.IsEmail))
  readonly email: string;

  @IsString()
  @MinLength(8, validationMessage(ValidatorTypes.MinLength))
  readonly password: string;
}