import { Controller, Get, Query } from "@nestjs/common";
import { EstadisticasService } from "./estadisticas.service";
import { EstadisticasDto } from "./dto/estadisticas.dto";


@Controller('estadisticas')
export class EstadisticasController {
    constructor(
        private readonly estadisticasService: EstadisticasService
    ) {}
    @Get('/usuarios')
    async getEstadisticas(@Query () query: EstadisticasDto): Promise<any> {
        return this.estadisticasService.getUserStats(query);
    }

    @Get('/maquinarias')
    async getEstadisticasMaquinarias(@Query () query: EstadisticasDto): Promise<any> {
        // return this.estadisticasService.getMaquinariaStats(query);
    }

    @Get('/ingresos')
    async getEstadisticasIngresos(@Query () query: EstadisticasDto): Promise<any> {
        // return this.estadisticasService.getIngresos(query);
    }
}