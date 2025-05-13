import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { validationMessage, ValidatorTypes } from 'src/utils/ValidatorMessages';

export class RecoveryPasswordDto {

    @IsString(validationMessage(ValidatorTypes.IsString))
    @IsNotEmpty(validationMessage(ValidatorTypes.isNotEmpty))
    @IsEmail({}, validationMessage(ValidatorTypes.IsEmail))
    readonly email: string;
}