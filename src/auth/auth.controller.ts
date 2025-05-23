import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { AuthCodeDto } from './dto/authCode.dto';
import { UserRole } from 'src/user/user.entity';
import { RoleGuard } from 'src/guards/role.guard';

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
}
