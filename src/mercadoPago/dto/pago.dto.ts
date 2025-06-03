import { IsNotEmpty, IsNumber } from 'class-validator';

export class PagoDto {

    @IsNotEmpty()
    @IsNumber()
    maq_id: number;

    @IsNotEmpty()
    @IsNumber()
    days: number;

    @IsNotEmpty()
    startDate: Date

    @IsNotEmpty()
    endDate: Date
}