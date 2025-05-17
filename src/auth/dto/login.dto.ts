import { PickType } from '@nestjs/mapped-types';
import { IsString, MinLength } from 'class-validator';
import { UserDto } from 'src/user/dto/user.dto';
import { validationMessage, ValidatorTypes } from 'src/utils/ValidatorMessages';

export class LoginDto extends PickType(UserDto, ['email', 'password']) {

    @IsString(validationMessage(ValidatorTypes.IsString))
    @MinLength(8, validationMessage(ValidatorTypes.MinLength))
    readonly password: string;
}