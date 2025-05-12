import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
        return this.userRepository.findOneBy({ id });
    }
    
    async findOneByEmail(email: string): Promise<User> {
        return await this.userRepository.findOneBy({ email })
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<void> {
        await this.userRepository.update(id, updateUserDto);
    }

    async remove(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }
}