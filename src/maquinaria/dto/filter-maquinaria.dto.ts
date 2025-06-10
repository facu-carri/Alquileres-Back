import { PartialType } from '@nestjs/mapped-types';
import { MaquinariaDto } from './maquinaria.dto';
import { MaquinariaStates, MaquinariaCategory} from '../maquinaria.entity';
import { Location } from "src/utils/enums/location.enum";
import { ReturnPolicy } from "src/utils/enums/return-policy.enum";
import { IsOptional, IsString, IsDefined, IsDateString } from 'class-validator';
import { validationMessage, ValidatorTypes } from 'src/utils/ValidatorMessages';

export class FilterMaquinariaDto extends PartialType(MaquinariaDto) {
  @IsOptional()
  @IsDefined()
  @IsString(validationMessage(ValidatorTypes.IsString))
  readonly nombre?: string;

  @IsOptional()
  @IsDefined()
  @IsString(validationMessage(ValidatorTypes.IsString))
  readonly marca?: string;

  @IsOptional()
  @IsDefined()
  @IsString(validationMessage(ValidatorTypes.IsString))
  readonly modelo?: string;

  @IsOptional()
  @IsDefined()
  @IsString(validationMessage(ValidatorTypes.IsString))
  readonly precio?: number;

  @IsOptional()
  @IsDefined()
  @IsString(validationMessage(ValidatorTypes.IsString))
  readonly año_adquisicion?: number;

  @IsOptional()
  @IsDefined()
  @IsString(validationMessage(ValidatorTypes.IsString))
  readonly sucursal?: Location;

  @IsOptional()
  @IsDefined()
  @IsString(validationMessage(ValidatorTypes.IsString))
  readonly categoria?: MaquinariaCategory;

  @IsOptional()
  @IsDefined()
  @IsString(validationMessage(ValidatorTypes.IsString))
  readonly politica?: ReturnPolicy;

  @IsOptional()
  @IsDefined()
  @IsString(validationMessage(ValidatorTypes.IsString))
  readonly state?: MaquinariaStates;

  @IsOptional()
  @IsDefined()
  @IsString(validationMessage(ValidatorTypes.IsString))
  readonly text?: string
  
  @IsOptional()
  @IsDefined()
  @IsDateString()
  readonly fecha_inicio?: Date;

  @IsOptional()
  @IsDefined()
  @IsDateString()
  readonly fecha_fin?: Date;  
}
