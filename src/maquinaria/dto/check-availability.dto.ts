import { IsString, IsNotEmpty } from 'class-validator';

export class CheckAvailabilityDto {
  // @IsDateString()
  @IsString()
  @IsNotEmpty()
  fecha_inicio: string;

  // @IsDateString()
  @IsString()
  @IsNotEmpty()
  fecha_fin: string;
}