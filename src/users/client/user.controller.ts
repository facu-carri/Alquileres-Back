import { Controller } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('client')
export class UserController {
  constructor(private readonly usersService: UserService) {}
}
