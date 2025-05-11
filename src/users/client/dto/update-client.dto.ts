import { PartialType } from '@nestjs/mapped-types';
import { ClientDto } from './client.dto';

export class UpdateClientDto extends PartialType(ClientDto) {
}
