import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { validationMessage, ValidatorTypes } from 'src/utils/ValidatorMessages';

export class AuthCodeDto {

    @IsString(validationMessage(ValidatorTypes.IsString))
    @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
    @IsEmail({}, validationMessage(ValidatorTypes.IsEmail))
    readonly email: string;

    @IsString(validationMessage(ValidatorTypes.IsString))
    @MinLength(4, validationMessage(ValidatorTypes.MinLength))
    readonly code: string;
}