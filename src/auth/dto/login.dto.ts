import { PickType } from '@nestjs/mapped-types';
import { UserDto } from 'src/user/dto/user.dto';

export class LoginDto extends PickType(UserDto, ['email', 'password']) {}