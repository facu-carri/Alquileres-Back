import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class ReseñaDto {

    constructor(puntaje: number, comentario?: string) {
        this.puntaje = puntaje;
        this.comentario = comentario;
    }
     
    @IsInt()
    @Min(1)
    @Max(5)
    puntaje: number;
        
    @IsOptional()
    @IsString()
    comentario?: string;
}