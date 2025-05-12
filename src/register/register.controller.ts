import { Controller, Post, Body } from '@nestjs/common';
import { RegisterService } from './register.service';
import { UserDto } from 'src/users/client/dto/user.dto';

@Controller('register')
export class RegisterController {
    constructor(private readonly registerService: RegisterService) {
        this.registerAdmin()
    }

    async registerAdmin() {
        const userAdminData: UserDto = {
            nombre: 'admin',
            apellido: '',
            password: '12345678',
            email: 'mannimaquinarias@gmail.com'
        }
        try {
            await this.registerService.register(userAdminData)
        } catch {
            console.log('El usuario administrador ya se encuentra registrado')
        }
    }

    @Post()
    async register(@Body() clientData: UserDto) {
        return await this.registerService.register(clientData)
    }
}