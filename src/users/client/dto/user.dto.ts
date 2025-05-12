import { IsString, IsEmail, IsNotEmpty, MinLength, IsPhoneNumber } from 'class-validator';
import { validationMessage, ValidatorTypes } from 'src/utils/ValidatorMessages';

export class UserDto {
    @IsString(validationMessage(ValidatorTypes.IsString))
    @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
    readonly nombre: string;

    @IsString(validationMessage(ValidatorTypes.IsString))
    @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
    readonly apellido: string;

    @IsString(validationMessage(ValidatorTypes.IsString))
    @MinLength(8, validationMessage(ValidatorTypes.MinLength))
    readonly password: string;

    readonly nacimiento: string;

    // Datos de contacto

    @IsString(validationMessage(ValidatorTypes.IsString))
    @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
    @IsEmail({}, validationMessage(ValidatorTypes.IsEmail))
    readonly email: string;

    @IsString(validationMessage(ValidatorTypes.IsString))
    @IsPhoneNumber('AR', validationMessage(ValidatorTypes.IsEmail))
    readonly telefono: string
}