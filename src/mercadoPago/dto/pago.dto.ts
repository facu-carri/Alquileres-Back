import { IsString, IsNotEmpty, IsDateString, IsNumber } from 'class-validator';

export class PagoDto {

    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsNumber()
    days: number;
}