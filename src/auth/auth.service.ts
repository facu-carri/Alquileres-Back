import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientService } from 'src/users/client/client.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly clientService: ClientService,
        private readonly jwtService: JwtService
    ) { }

    async login(loginData: LoginDto) {
        const client = await this.clientService.findOneByEmail(loginData.email)
        if (!client) {
            throw new UnauthorizedException("El mail no se encuentra registrado")
        }

        const isPasswordValid = client.password == loginData.password
        if (!isPasswordValid) {
            throw new UnauthorizedException("La contrasenia es incorrecta")
        }

        const payload = {
            email: loginData.email
        }

        const jwtToken = await this.jwtService.signAsync(payload)
        const rol = 'client'//client.rol

        return { jwtToken, rol }
    }
}
