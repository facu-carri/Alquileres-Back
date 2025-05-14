import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { AuthCodeDto } from './dto/authCode.dto';

@Controller('login')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    async login(@Body() loginData: LoginDto) {
        return await this.authService.login(loginData)
    }

    @Post('auth')
    async authenticate(@Body() authData: AuthCodeDto) {
        return await this.authService.authenticate(authData)
    }

    // Esto es un ejemplo de una ruta que necesita autorizacion (jwt)
    @Get('profile')
    @UseGuards(AuthGuard)
    async profile() {
        return 'Access to profile'
    }
}
