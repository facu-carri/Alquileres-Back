import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { validationMessage, ValidatorTypes } from 'src/utils/ValidatorMessages';

export class ChangePasswordDto {

    @IsString(validationMessage(ValidatorTypes.IsString))
    @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
    @IsEmail({}, validationMessage(ValidatorTypes.IsEmail))
    readonly email: string;

    @IsString(validationMessage(ValidatorTypes.IsString))
    @MinLength(8, validationMessage(ValidatorTypes.MinLength))
    readonly newPassword: string

    @IsOptional()
    @IsString(validationMessage(ValidatorTypes.IsString))
    @MinLength(8, validationMessage(ValidatorTypes.MinLength))
    readonly currentPassword?: string

    @IsOptional()
    @IsString(validationMessage(ValidatorTypes.IsString))
    readonly token?: string
}