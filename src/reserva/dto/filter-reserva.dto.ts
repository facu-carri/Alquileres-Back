import { IsOptional, IsDefined, IsDateString, IsEnum, IsString, IsNumber } from 'class-validator';
import { ReservaStates } from '../reserva.entity';
import { UserRole } from 'src/user/user.entity';
import { Sucursal } from 'src/utils/enums';

export class FilterReservaDto {
  @IsOptional()
  @IsDefined()
  @IsNumber()
  readonly id?: number;

  @IsOptional()
  @IsDefined()
  @IsString()
  readonly texto?: string;

  @IsOptional()
  @IsDefined()
  @IsString()
  readonly maquinaria_id?: number;

  @IsOptional()
  @IsDefined()
  @IsString()
  readonly maquinaria_inventario?: string;

  @IsOptional()
  @IsDefined()
  @IsString()
  user_email?: string;

  @IsOptional()
  @IsDefined()
  @IsString()
  user_id?: number;

  @IsOptional()
  @IsDefined()
  @IsEnum(ReservaStates)
  readonly estado?: ReservaStates;

  @IsOptional()
  @IsDefined()
  @IsEnum(Sucursal)
  readonly sucursal?: Sucursal;

  // @IsOptional()
  // @IsDefined()
  // @IsDateString()
  // readonly fecha_inicio?: Date;

  // @IsOptional()
  // @IsDefined()
  // @IsDateString()
  // readonly fecha_fin?: Date;
}