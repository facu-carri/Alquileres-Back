import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/users/client/user.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly UserService: UserService,
        private readonly jwtService: JwtService
    ) { }

    async login(loginData: LoginDto) {
        const user = await this.UserService.findOneByEmail(loginData.email)
        if (!user) {
            throw new UnauthorizedException("El mail no se encuentra registrado")
        }

        const isPasswordValid = user.password == loginData.password
        if (!isPasswordValid) {
            throw new UnauthorizedException("La contrasenia es incorrecta")
        }

        const payload = {
            email: loginData.email
        }

        const jwtToken = await this.jwtService.signAsync(payload)
        const rol = user.rol

        return { jwtToken, rol }
    }
}
