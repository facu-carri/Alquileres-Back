import { IsOptional, IsDefined, IsString, IsEnum, IsNumber } from "class-validator";
import { Sucursal } from "src/utils/enums";
import { AlquilerStates } from "../alquiler.entity";

export class FilterAlquilerDto {
    @IsOptional()
    @IsDefined()
    @IsNumber()
    readonly id?: number;

    @IsOptional()
    @IsDefined()
    @IsString()
    readonly texto?: string;

    @IsOptional()
    @IsDefined()
    @IsString()
    readonly maquinaria_id?: number;
      
    @IsOptional()
    @IsDefined()
    @IsString()
    readonly maquinaria_inventario?: string;
      
    @IsOptional()
    @IsDefined()
    @IsString()
    user_email?: string;
      
    @IsOptional()
    @IsDefined()
    @IsString()
    user_id?: number;

    @IsOptional()
    @IsDefined()
    @IsEnum(AlquilerStates)
    readonly estado?: AlquilerStates;
    
    @IsOptional()
    @IsDefined()
    @IsEnum(Sucursal)
    readonly sucursal?: Sucursal;
}