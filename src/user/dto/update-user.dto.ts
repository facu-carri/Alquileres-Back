import { OmitType, PartialType } from '@nestjs/mapped-types';
import { UserDto } from './user.dto';

export class UpdateUserDto extends PartialType(UserDto) { }

export class UpdateUserDtoWithoutPassword extends PartialType(OmitType(UserDto, ['password'])) {}
