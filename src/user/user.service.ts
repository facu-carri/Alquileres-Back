import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRoles } from './user.entity';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(UserDto: UserDto): Promise<User> {
        return await this.userRepository.save(UserDto);
    }

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async findByRol(rol: UserRoles): Promise<User[]> {
        return await this.userRepository.findBy({ rol })
    }

    async findOneByEmail(email: string): Promise<User> {
        return await this.userRepository.findOneBy({ email })
    }

    async findOne(id: number): Promise<User> {
        return this.userRepository.findOneBy({ id });
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<void> {
        await this.userRepository.update(id, updateUserDto);
    }

    async remove(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }
}