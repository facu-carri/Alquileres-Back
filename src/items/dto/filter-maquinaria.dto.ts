import { PartialType } from '@nestjs/mapped-types';
import { MaquinariaDto } from './maquinaria.dto';
import { MaquinariaStates } from '../maquinaria.entity';
import { IsEnum, IsOptional, IsString, isString, IsDefined } from 'class-validator';
import { validationMessage, ValidatorTypes } from 'src/utils/ValidatorMessages';

export class FilterMaquinariaDto extends PartialType(MaquinariaDto) {
  @IsOptional()
  @IsDefined()
  @IsEnum(MaquinariaStates, { ...validationMessage(ValidatorTypes.IsEnum), context: { constraints: [Object.values(MaquinariaStates)] } })
  readonly state?: MaquinariaStates;

  @IsOptional()
  @IsDefined()
  @IsString(validationMessage(ValidatorTypes.IsString))
  readonly text?: string
}