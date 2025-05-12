import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity';
import { ItemDto } from './dto/item.dto';
import { UpdateItemDto } from './dto/update-item.dto';


@Injectable()
export class ItemService {

    constructor(
        @InjectRepository(Item)
        private readonly ItemRepository: Repository<Item>,
    ) {}

    async create(itemDto: ItemDto): Promise<Item> {
        return await this.ItemRepository.save(itemDto);
    }

    async findAll(): Promise<Item[]> {
        return await this.ItemRepository.find();
    }

    async findOne(id: number): Promise<Item> {
        return this.ItemRepository.findOneBy({ id });
    }

    async update(id: number, updateItemDto: UpdateItemDto): Promise<void> {
        await this.ItemRepository.update(id, updateItemDto);
    }

    async remove(id: number): Promise<void> {
        await this.ItemRepository.delete(id);
    }
}