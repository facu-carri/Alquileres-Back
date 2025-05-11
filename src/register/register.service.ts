import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/users/client/user.service';
import { UserDto } from 'src/users/client/dto/user.dto';

@Injectable()
export class RegisterService {
    
    constructor(private readonly UserService: UserService){}
    
    async register(clientData: UserDto) {
        const client = await this.UserService.findOneByEmail(clientData.email)
        if (client) {
            throw new BadRequestException('El mail ya se encuentra registrado')
        }
        return await this.UserService.create(clientData)
    }
}
