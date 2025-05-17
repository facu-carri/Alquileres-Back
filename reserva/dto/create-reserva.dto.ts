import { IsInt, IsNotEmpty, IsDateString, IsEnum } from 'class-validator';

export class CreateReservaDto {
    @IsInt()
    @IsNotEmpty()
    maquinariaId: number;

    @IsInt()
    @IsNotEmpty()
    usuarioId: number;

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