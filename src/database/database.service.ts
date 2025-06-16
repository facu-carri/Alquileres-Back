import { Injectable } from '@nestjs/common';
import { InitializeUsers } from './initializers/users';
import { InitializeMaquinarias } from './initializers/maquinarias';
import { RegisterService } from 'src/register/register.service';
import { MaquinariaService } from 'src/maquinaria/maquinaria.service';
import { InitializeReservas } from './initializers/reservas';
import { ReservaService } from 'src/reserva/reserva.service';
import { UserService } from 'src/user/user.service';
import { AlquilerService } from 'src/alquiler/alquiler.service';

@Injectable()
export class DatabaseService {

    constructor(
        private readonly registerService: RegisterService,
        private readonly maquinariaService: MaquinariaService,
        private readonly reservaService: ReservaService,
        private readonly userService: UserService,
        private readonly alquilerService: AlquilerService,
    ) {
        this.initDatabase();
    }

    async initDatabase() {
        const initializeUsers = new InitializeUsers(this.registerService, this.userService);
        await initializeUsers.init();
        const initializeMaquinarias = new InitializeMaquinarias(this.maquinariaService);
        await initializeMaquinarias.init();
        const initializeReservas = new InitializeReservas(this.reservaService, this.maquinariaService, this.userService, this.alquilerService);
        await initializeReservas.init();
    }
}