import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { UserDto } from 'src/user/dto/user.dto';
import { UserRole } from 'src/user/user.entity';

@Injectable()
export class RegisterService {
    
    constructor(private readonly UserService: UserService){}
    
    async register(clientData: UserDto, rol: UserRole) {
        const client = await this.UserService.findOneByEmail(clientData.email)
        if (client) {
            throw new BadRequestException('El mail ya se encuentra registrado')
        }
        return await this.UserService.create(clientData, rol)
    }
}
