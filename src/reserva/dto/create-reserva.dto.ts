import { IsInt, IsNotEmpty, IsDateString, IsEnum, IsString } from 'class-validator';

export class CreateReservaDto {
    @IsInt()
    @IsNotEmpty()
    maquinariaId: number;

    // @IsInt()
    // @IsNotEmpty()
    // usuarioId: number;

    @IsString()
    @IsNotEmpty()
    usuarioEmail: string;

    @IsDateString()
    @IsNotEmpty()
    fecha_inicio: Date;

    @IsDateString()
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