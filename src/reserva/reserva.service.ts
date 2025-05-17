import { Repository } from "typeorm";
import { Reserva } from "./reserva.entity";
import { InjectRepository } from "@nestjs/typeorm";

export class ReservaService {

    constructor(
        @InjectRepository(Reserva)
        private readonly reservaRepository: Repository<Reserva>,
    ) { }
    
}