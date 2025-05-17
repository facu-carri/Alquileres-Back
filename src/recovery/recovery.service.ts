import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecoveryToken } from './token.entity';
import { RecoveryPasswordDto } from './dto/password.dto';
import { RecoveryTokenDto } from './dto/token.dto';
import { ChangePasswordDto } from './dto/chnagePassword.dto';
import { response } from 'express';
import { UserService } from 'src/user/user.service';
import { sendMail } from 'src/utils/Mailer';
import { generateCode } from 'src/utils/Utils';
import { UserRole } from 'src/user/user.entity';

@Injectable()
export class RecoveryService {

    constructor(
        @InjectRepository(RecoveryToken)
        private readonly recoveryTokenRepository: Repository<RecoveryToken>,
        private readonly userService: UserService,
    ) {}

    async checkToken(data: RecoveryTokenDto) {
        const tokenData = await this.recoveryTokenRepository.findOneBy({ email: data.email })
        if (!tokenData) {
            throw new NotFoundException()
        }
        if (data.token != tokenData.token) {
            throw new BadRequestException('El codigo es invalido')
        }
        return response.status(200)
    }

    async recoveryPassword(data: RecoveryPasswordDto) {
        const userExist = await this.userService.existBy({ email: data.email })
        if (!userExist) {
            throw new NotFoundException()
        }
        const token = generateCode(8)
        await this.recoveryTokenRepository.save({ token, email: data.email })
        console.log('Recovery Password token:', token)
        sendMail(data.email, "Recuperar contraseña", `Ingrese a este enlace para recuperar su contraseña\nhttps://localhost:3000/recovery?token=${token}&email=${data.email}`)
        return response.status(200)
    }

    async changePassword(data: ChangePasswordDto) {
        const user = await this.userService.findOneByEmail(data.email)

        if (!user) throw new NotFoundException()
        if (user.rol != UserRole.Cliente) throw new UnauthorizedException()
        
        if (data.token) {
            await this.checkToken({ token: data.token, email: data.email })
            await this.recoveryTokenRepository.delete({email: data.email})
        } else {
            if (!data.currentPassword || user.password != data.currentPassword) {
                throw new BadRequestException()
            }
        }
        return this.userService.update({ email: data.email }, { password: data.newPassword })
    }
}