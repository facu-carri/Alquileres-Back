import { PickType } from '@nestjs/mapped-types';
import { UserDto } from 'src/users/client/dto/user.dto';

export class LoginDto extends PickType(UserDto, ['email', 'password']) {}