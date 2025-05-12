import { PartialType } from '@nestjs/mapped-types';
import { ItemDto } from './item.dto';

export class UpdateItemDto extends PartialType(ItemDto) {
}
