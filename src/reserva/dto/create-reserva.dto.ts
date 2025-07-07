import { IsNumber, IsNotEmpty, IsDateString, IsEnum, IsString } from 'class-validator';

export class CreateReservaDto {

    @IsNumber( { allowInfinity: false, allowNaN: false } )
    @IsNotEmpty()
    id_maquinaria: number;

    // @IsNumber()
    // @IsNotEmpty()
    // id_usuario: number;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    fecha_inicio: Date;

    @IsNotEmpty()
    fecha_fin: Date;

    // Copiar de maquinaria

    // @IsInt()
    // @IsNotEmpty()
    // precio_dia: number;

    // @IsEnum(ReturnPolicy)
    // @IsNotEmpty()
    // politica: ReturnPolicy;
}