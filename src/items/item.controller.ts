import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { Item } from './item.entity';
import { ItemDto } from './dto/item.dto';
import { ItemService } from './item.service';

@Controller('items')
export class ItemController {
  constructor(private readonly itemsService: ItemService) {}

  @Get()
  findAll(): Promise<Item[]> {
    return this.itemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Item> {
    return this.itemsService.findOne(id);
  }

  @Post()
  create(@Body() itemDto: ItemDto): Promise<Item> {
    return this.itemsService.create(itemDto);
  }
}