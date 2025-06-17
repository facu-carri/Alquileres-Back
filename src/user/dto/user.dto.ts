import { IsString, IsEmail, IsNotEmpty, MinLength, IsPhoneNumber, IsOptional } from 'class-validator';
import { validationMessage, ValidatorTypes } from 'src/utils/ValidatorMessages';

export class UserDto {

    @IsString(validationMessage(ValidatorTypes.IsString))
    @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
    @IsEmail({}, validationMessage(ValidatorTypes.IsEmail))
    readonly email: string;

    @IsOptional()
    @IsString(validationMessage(ValidatorTypes.IsString))
    @MinLength(8, validationMessage(ValidatorTypes.MinLength))
    password?: string;

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
    @IsPhoneNumber(null, validationMessage(ValidatorTypes.IsPhoneNumber))
    readonly telefono: string

    readonly isActive?: boolean;
}