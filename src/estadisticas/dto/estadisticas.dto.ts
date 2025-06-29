import { IsOptional } from "class-validator";

export class EstadisticasDto {
  
    @IsOptional()
    readonly fecha_inicio?: Date;

    @IsOptional()
    readonly fecha_fin?: Date;

    @IsOptional()
    readonly tamaño?: string;
}