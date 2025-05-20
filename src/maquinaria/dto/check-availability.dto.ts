import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CheckAvailabilityDto {
  @IsDateString()
  @IsString()
  @IsNotEmpty()
  fecha_inicio: string;

  @IsDateString()
  @IsString()
  @IsNotEmpty()
  fecha_fin: string;
}