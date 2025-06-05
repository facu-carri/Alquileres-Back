import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { UserDto } from 'src/user/dto/user.dto';
import { UserRole } from 'src/user/user.entity';
import { response } from 'express';

@Injectable()
export class RegisterService {
    
    constructor(private readonly userService: UserService){}
    
    async register(usertData: UserDto, rol: UserRole) {
        const client = await this.userService.findOneByEmail(usertData.email)
        if (client) {
            throw new BadRequestException('El email ya se encuentra registrado.')
        }
        await this.userService.create(usertData, rol)
        return response.status(200)
    }
}
