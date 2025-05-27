import { IsString, IsNotEmpty, IsDateString, IsNumber } from 'class-validator';

export class PagoDto {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;
}