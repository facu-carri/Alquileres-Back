import { PickType } from '@nestjs/mapped-types';
import { ClientDto } from 'src/users/client/dto/client.dto';

export class LoginDto extends PickType(ClientDto, ['email', 'password']) {}