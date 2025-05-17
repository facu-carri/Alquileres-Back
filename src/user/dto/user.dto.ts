import { IsString, IsEmail, IsNotEmpty, MinLength, IsPhoneNumber } from 'class-validator';
import { validationMessage, ValidatorTypes } from 'src/utils/ValidatorMessages';

export class UserDto {

    @IsString(validationMessage(ValidatorTypes.IsString))
    @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
    @IsEmail({}, validationMessage(ValidatorTypes.IsEmail))
    readonly email: string;

    readonly password: string;

    @IsString(validationMessage(ValidatorTypes.IsString))
    readonly dni: string
    
    @IsString(validationMessage(ValidatorTypes.IsString))
    @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
    readonly nombre: string;

    @IsString(validationMessage(ValidatorTypes.IsString))
    @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
    readonly apellido: string;

    @IsString(validationMessage(ValidatorTypes.IsString))
    readonly nacimiento: string;

    @IsString(validationMessage(ValidatorTypes.IsString))
    readonly telefono: string
}