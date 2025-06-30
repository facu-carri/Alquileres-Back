import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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

    @IsOptional()
    @IsString()
    user_email: string;
}