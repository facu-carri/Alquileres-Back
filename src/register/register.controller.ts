import { Controller, Post, Body } from '@nestjs/common';
import { RegisterService } from './register.service';
import { ClientDto } from 'src/users/client/dto/client.dto';

@Controller('register')
export class RegisterController {
    constructor(private readonly registerService: RegisterService) {}

    @Post()
    async register(@Body() clientData: ClientDto) {
        return await this.registerService.register(clientData)
    }
}