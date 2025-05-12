import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity';
import { ItemDto } from './dto/item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async create(itemDto: ItemDto): Promise<Item> {
    const item = this.itemRepository.create(itemDto);
    return await this.itemRepository.save(item);
  }

  async findAll(): Promise<Item[]> {
    return await this.itemRepository.find();
  }

  async findOne(id: number): Promise<Item> {
    const item = await this.itemRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`No se encontró el item con id ${id}`);
    }
    return item;
  }

  async update(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    const item = await this.findOne(id);
    this.itemRepository.merge(item, updateItemDto);
    return await this.itemRepository.save(item);
  }

  async remove(id: number): Promise<void> {
    const result = await this.itemRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`No se encontró el item con id ${id}`);
    }
  }
}