import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly UserRepository: Repository<User>,
    ) {}

    async create(UserDto: UserDto): Promise<User> {
        return await this.UserRepository.save(UserDto);
    }

    async findAll(): Promise<User[]> {
        return await this.UserRepository.find();
    }

    async findOneByEmail(email: string): Promise<User> {
        return await this.UserRepository.findOneBy({ email })
    }

    async findOne(id: number): Promise<User> {
        return this.UserRepository.findOneBy({ id });
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<void> {
        await this.UserRepository.update(id, updateUserDto);
    }

    async remove(id: number): Promise<void> {
        await this.UserRepository.delete(id);
    }
}