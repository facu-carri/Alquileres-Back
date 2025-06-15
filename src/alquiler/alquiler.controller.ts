import { Controller } from "@nestjs/common";
import { AlquilerService } from "./alquiler.service";

@Controller('alquiler')
export class AlquilerController {
    constructor(private readonly alquilerService: AlquilerService) {}
}