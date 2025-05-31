import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from 'src/user/user.entity';
import { sendMail } from 'src/utils/Mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCode } from './dto/authCode.entity';
import { Repository } from 'typeorm';
import { AuthCodeDto } from './dto/authCode.dto';
import { generateCode } from 'src/utils/Utils';
import { JwtPayload } from './jwt/jwtPayload';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(AuthCode)
        private readonly authRepository: Repository<AuthCode>,
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    async login(loginData: LoginDto) {
        const user: User = await this.userService.findOneByEmail(loginData.email)
        if (!user) {
            throw new UnauthorizedException("El mail no se encuentra registrado")
        }

        const isPasswordValid = user.password == loginData.password
        if (!isPasswordValid) {
            throw new UnauthorizedException("La contraseña es incorrecta")
        }

        if (!user.isActive) {
            throw new UnauthorizedException("El usuario está inhabilitado")
        }

        const rol = user.rol
        const requireAuth = rol == UserRole.Admin || rol == UserRole.Empleado
        let token = null

        if (requireAuth) this.sendAuthCode(user.email)
        else {
            token = await this.generateToken(user)
        }

        return { token, rol, id: user.id }
    }

    private async generateToken(user:User) {
        const payload: JwtPayload = {
            email: user.email,
            rol: user.rol
        }
        return await this.jwtService.signAsync(payload)
    }

    async sendAuthCode(email: string) {
        const code = generateCode(4)
        const authCodeDto: AuthCodeDto = {
            code: code,
            email: email
        }

        try { await this.authRepository.save(authCodeDto) }
        catch { await this.authRepository.update({ email }, { code: code }) }

        sendMail(email, 'Codigo de autenticacion', `El codigo de autenticacion es ${code}`)
        console.log('Auth code:', code)
    }

    async authenticate(authCodeDto: AuthCodeDto) {
        const authData = await this.authRepository.findOneBy({ email: authCodeDto.email })

        if(!authData) throw new NotFoundException('No se encontro un token asociado al mail')
        if (authCodeDto.code != authData.code) throw new UnauthorizedException('Token invalido')
        
        await this.authRepository.delete({ code: authData.code });
        
        const user = await this.userService.findOneByEmail(authData.email)
        const token = await this.generateToken(user)
        const rol = user.rol

        return { token, rol, id: user.id }
    }
}
