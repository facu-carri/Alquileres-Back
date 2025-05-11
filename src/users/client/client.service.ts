import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';
import { ClientDto } from './dto/client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {

    constructor(
        @InjectRepository(Client)
        private readonly clientRepository: Repository<Client>,
    ) {}

    async create(clientDto: ClientDto): Promise<Client> {
        return await this.clientRepository.save(clientDto);
    }

    async findAll(): Promise<Client[]> {
        return await this.clientRepository.find();
    }

    async findOneByEmail(email: string): Promise<Client> {
        return await this.clientRepository.findOneBy({ email })
    }

    async findOne(id: number): Promise<Client> {
        return this.clientRepository.findOneBy({ id });
    }

    async update(id: number, updateclientDto: UpdateClientDto): Promise<void> {
        await this.clientRepository.update(id, updateclientDto);
    }

    async remove(id: number): Promise<void> {
        await this.clientRepository.delete(id);
    }
}