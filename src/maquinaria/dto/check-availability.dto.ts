import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CheckAvailabilityDto {
  @IsDateString()
  @IsString()
  @IsNotEmpty()
  fecha_inicio: Date;

  @IsDateString()
  @IsString()
  @IsNotEmpty()
  fecha_fin: Date;
}