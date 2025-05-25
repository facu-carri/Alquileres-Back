import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { response } from 'express';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(userDto: UserDto, rol: UserRole): Promise<User> {
        return await this.userRepository.save({ ...userDto, rol: rol });
    }

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async findAllByRol(rol: UserRole): Promise<User[]> {
        return await this.userRepository.findBy({ rol })
    }

    async findOne(id: number): Promise<User> {
        return await this.userRepository.findOneBy({ id });
    }
    
    async findOneByEmail(email: string): Promise<User> {
        return await this.userRepository.findOneBy({ email })
    }

    async existBy(obj: Partial<User>): Promise<boolean> {
        return !!(await this.userRepository.findOneBy(obj))
    }

    async getUserById(id: number): Promise<User> {
        const user = await this.findOne(id);
        if(!user) throw new NotFoundException('No se encontro el id')
        return user
    }

    async sameUserById(email: string, id: number): Promise<boolean> {
        const userByEmail = await this.findOneByEmail(email)
        const userById = await this.getUserById(id)
        return userByEmail && userById ? userByEmail.id == userById.id : false
    }

    async update(obj: Partial<User>, updateUserDto: UpdateUserDto): Promise<any> {
        if (!this.existBy(obj)) throw new NotFoundException('No se encontro el usuario')
        await this.userRepository.update(obj, updateUserDto);
        return response.status(200)
    }

    // El email enviado en obj suele ser el cargado en payload
    // si se quiere modificar un usuario mediante un rol
    // El email debe ser cambiado por el del usuario target (se lo busca segun el id)
    async getTargetEmail(obj: Partial<User>, role: UserRole, wantedRoles: UserRole[]): Promise<void> {
        if (wantedRoles.includes(role)) {
            const user = await this.getUserById(obj.id ?? 0)
            if (user) obj.email = user.email
            else obj.email = ''
        }
    }

    async modifyUser(obj: Partial<User>, updateUserDto: UpdateUserDto, role: UserRole): Promise<any> {
        await this.getTargetEmail(obj, role, [UserRole.Admin])
        return await this.update(obj, updateUserDto)
    }

    async deleteUser(obj: Partial<User>, role: UserRole): Promise<any> {
        await this.getTargetEmail(obj, role, [UserRole.Admin])
        return this.remove(obj)
    }

    async remove(obj: Partial<User>): Promise<any> {
        if (!this.existBy(obj)) throw new NotFoundException('No se encontro el usuario')
        await this.userRepository.delete(obj);
        return response.status(200)
    }
}