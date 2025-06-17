import { Controller, Post, Body, UseInterceptors, Req, BadRequestException, HttpStatus, HttpCode } from '@nestjs/common';
import { RegisterService } from './register.service';
import { UserDto } from 'src/user/dto/user.dto';
import { UserRole } from 'src/user/user.entity';
import { UserInterceptor } from 'src/interceptors/user-interceptor';

@Controller('register')
export class RegisterController {
    constructor(private readonly registerService: RegisterService) {
        this.initAdminUser()
    }

    async initAdminUser() {
        const userAdminData: UserDto = {
            nombre: 'admin',
            apellido: '',
            password: '12345678',
            email: 'mannimaquinarias@gmail.com',
            telefono: '',
            dni: '',
            nacimiento: ''
        }
        try {
            await this.registerService.register(userAdminData, UserRole.Admin)
        } catch {}
    }

    @UseInterceptors(UserInterceptor)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() userData: UserDto, @Req() req) {
        switch (req.user.rol) {
            case 'visitante':
                return await this.registerService.register(userData, UserRole.Cliente);
            case UserRole.Empleado:
                return await this.registerService.registerRandomPassword(userData, UserRole.Cliente);
            case UserRole.Admin:
                return await this.registerService.registerRandomPassword(userData, UserRole.Empleado);
            default:
                throw new BadRequestException('Rol no valido');
        }
    }
}