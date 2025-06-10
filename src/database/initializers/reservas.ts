import { ReservaService } from "src/reserva/reserva.service";
import { MaquinariaService } from "src/maquinaria/maquinaria.service";
import { UserRole } from "src/user/user.entity";
import { CreateReservaDto } from "src/reserva/dto/create-reserva.dto";
import { UserService } from "src/user/user.service";
import { MaquinariaStates } from "src/maquinaria/maquinaria.entity";

export class InitializeReservas {
    private readonly HARDCODED_EMAIL = 'cliente@hotmail.com';

    constructor(
        private readonly reservaService: ReservaService,
        private readonly maquinariaService: MaquinariaService,
        private readonly userService: UserService
    ) { }

    async init() {
        const reservas = await this.reservaService.findAll();
        if (reservas.length > 0) return;

        this.genHard();
    }

    async genHard() {
        const maquinaria = await this.maquinariaService.findAll({state: MaquinariaStates.Disponible}, UserRole.Admin);
        const user = await this.userService.findOneByEmail(this.HARDCODED_EMAIL);
        if (!user) {
            console.log('No se encontro el usuario');
            return;
        }

        maquinaria.forEach(element => {
            const reserva = new CreateReservaDto();
            reserva.id_maquinaria = element.id;
            reserva.email = user.email;
            reserva.fecha_inicio = new Date(Date.now() + 86400000*10);
            reserva.fecha_fin = new Date(reserva.fecha_inicio.getTime() + 86400000);
            this.reservaService.create(reserva);
        });


    }

    async genRandom() {
        const maquinaria = await this.maquinariaService.findAll({state: MaquinariaStates.Disponible}, UserRole.Admin);
        if (maquinaria.length === 0) {
            console.log('No hay maquinaria disponible para crear reservas');
            return;
        }


        const users = (await this.userService.findAllByRol(UserRole.Cliente)).filter(user => user.isActive);
        if (users.length === 0) {
            console.log('No hay clientes para crear reservas');
            return;
        }
        for (let i = 0; i < 10; i++) {
            let randomMaquinaria = maquinaria[Math.floor(Math.random() * maquinaria.length)];

            const randomUser = users[Math.floor(Math.random() * users.length)];
            const reserva = new CreateReservaDto();

            reserva.id_maquinaria = randomMaquinaria.id;
            reserva.email = randomUser.email;

            reserva.fecha_inicio = new Date(Date.now() + Math.floor(Math.random() * 90) * 86400000);
            reserva.fecha_fin = new Date(reserva.fecha_inicio.getTime() + (Math.floor(Math.random() * 7) + 1) * 86400000);

            while (!this.maquinariaService.checkAvailability(randomMaquinaria.id, reserva.fecha_inicio, reserva.fecha_fin)) {
                reserva.fecha_inicio = new Date(reserva.fecha_inicio.getTime() + 86400000);
                reserva.fecha_fin = new Date(reserva.fecha_fin.getTime() + 86400000);
            }

            await this.reservaService.create(reserva);
        }
    }
}
