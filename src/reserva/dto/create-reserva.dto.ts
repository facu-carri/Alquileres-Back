import { IsNumber, IsNotEmpty, IsDateString, IsEnum, IsString } from 'class-validator';

export class CreateReservaDto {

    @IsNumber( { allowInfinity: false, allowNaN: false } )
    @IsNotEmpty()
    maquinariaId: number;

    // @IsNumber()
    // @IsNotEmpty()
    // usuarioId: number;

    @IsString()
    @IsNotEmpty()
    usuarioEmail: string;

    @IsString()
    // @IsDateString()
    @IsNotEmpty()
    fecha_inicio: Date;

    @IsString()
    // @IsDateString()
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