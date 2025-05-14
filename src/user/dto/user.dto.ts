import { IsString, IsEmail, IsNotEmpty, MinLength, IsPhoneNumber } from 'class-validator';
import { validationMessage, ValidatorTypes } from 'src/utils/ValidatorMessages';

export class UserDto {

    @IsString(validationMessage(ValidatorTypes.IsString))
    @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
    @IsEmail({}, validationMessage(ValidatorTypes.IsEmail))
    readonly email: string;

    @IsString(validationMessage(ValidatorTypes.IsString))
    @MinLength(8, validationMessage(ValidatorTypes.MinLength))
    readonly password: string;

    @IsString(validationMessage(ValidatorTypes.IsString))
    readonly dni: string
    
    @IsString(validationMessage(ValidatorTypes.IsString))
    @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
    readonly nombre: string;

    @IsString(validationMessage(ValidatorTypes.IsString))
    @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
    readonly apellido: string;

    readonly nacimiento: string;

    @IsString(validationMessage(ValidatorTypes.IsString))
    @IsPhoneNumber('AR', validationMessage(ValidatorTypes.IsEmail))
    readonly telefono: string
}