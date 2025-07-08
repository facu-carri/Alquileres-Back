import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { UserDto } from 'src/user/dto/user.dto';
import { UserRole } from 'src/user/user.entity';
import { response } from 'express';
import { sendMail } from 'src/utils/Mailer';

@Injectable()
export class RegisterService {
    
    constructor(private readonly userService: UserService){}

    generateRandomPassword() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for (let i = 0; i < 8; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += characters.charAt(randomIndex);
        }
        return password;
    }
    
    async register(userData: UserDto, rol: UserRole) {
        let client = await this.userService.findOneByEmail(userData.email)
        if (client) {
            throw new BadRequestException('El email ya se encuentra registrado.')
        }

        client = await this.userService.findOneByDni(userData.dni)
        if (client) {
            throw new BadRequestException('El DNI ya se encuentra registrado.')
        }
        
        if (!userData.password) {
            throw new BadRequestException('La contraseña es obligatoria.')
        }

        await this.userService.create(userData, rol)
        return response.status(200)
    }

    async registerRandomPassword(userData: UserDto, rol: UserRole) {
        let user = await this.userService.findOneByEmail(userData.email)
        if (user) {
            throw new BadRequestException('El email ya se encuentra registrado.')
        }
        user = await this.userService.findOneByDni(userData.dni)
        if (user) {
            throw new BadRequestException('El DNI ya se encuentra registrado.')
        }
        userData.password = this.generateRandomPassword()
        await this.userService.create(userData, rol)
        console.log(`Se ha registrado un nuevo ${rol} con email: ${userData.email} con la contraseña: ${userData.password}`)

        let mail = `Hola ${userData.nombre}, tu registro ha sido exitoso. Tu contraseña es: ${userData.password}`
        sendMail(userData.email, 'Registro exitoso', mail)

        return response.status(200)
    }
}
