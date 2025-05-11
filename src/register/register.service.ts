import { BadRequestException, Injectable } from '@nestjs/common';
import { ClientService } from 'src/users/client/client.service';
import { ClientDto } from 'src/users/client/dto/client.dto';

@Injectable()
export class RegisterService {
    constructor(private readonly clientService: ClientService){}
    
    async register(clientData: ClientDto) {
        const clientExist = !!this.clientService.findOneByEmail(clientData.email)
        if (clientExist) {
            throw new BadRequestException('El mail ya se encuentra registrado')
        }
        return await this.clientService.create(clientData)
    }
}
