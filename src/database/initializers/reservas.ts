import { ReservaService } from "src/reserva/reserva.service";
import { MaquinariaService } from "src/maquinaria/maquinaria.service";
import { UserRole } from "src/user/user.entity";
import { CreateReservaDto } from "src/reserva/dto/create-reserva.dto";
import { UserService } from "src/user/user.service";
import { MaquinariaStates } from "src/maquinaria/maquinaria.entity";
import { AlquilerService } from "src/alquiler/alquiler.service";
import { ReseñaDto } from "src/alquiler/dto/reseña.dto";

export class InitializeReservas {
    private readonly HARDCODED_EMAIL = 'cliente@hotmail.com';
    private readonly DAY_CONSTANT = 86400000; // 24 * 60 * 60 * 1000

    constructor(
        private readonly reservaService: ReservaService,
        private readonly maquinariaService: MaquinariaService,
        private readonly userService: UserService,
        private readonly alquilerService: AlquilerService
    ) { }

    async init() {
        const reservas = await this.reservaService.findAll();
        if (reservas.length > 0) return;

        this.genHard();
        this.genRandom();
    }

    async genHard() {
        const maquinaria = await this.maquinariaService.findAll({ state: MaquinariaStates.Disponible }, UserRole.Admin);
        const user = await this.userService.findOneByEmail(this.HARDCODED_EMAIL);
        if (!user) {
            console.log('No se encontro el usuario');
            return;
        }
        for (const element of maquinaria) {
            const reserva = new CreateReservaDto();
            reserva.id_maquinaria = element.id;
            reserva.email = user.email;
            reserva.fecha_inicio = new Date(Date.now() + this.DAY_CONSTANT * 10);
            reserva.fecha_fin = new Date(reserva.fecha_inicio.getTime() + this.DAY_CONSTANT * 5);
            await this.reservaService.create(reserva);
        }
        let c = 0;
        for (const element of maquinaria) {
            const reserva = new CreateReservaDto();
            reserva.id_maquinaria = element.id;
            reserva.email = user.email;
            reserva.fecha_inicio = new Date(Date.now() - this.DAY_CONSTANT * 50);
            reserva.fecha_fin = new Date(reserva.fecha_inicio.getTime() + this.DAY_CONSTANT * 5);
            const res = await this.reservaService.create(reserva);
            await this.reservaService.confirmarReserva(res.id);
            if (c % 2 === 0) {
                const alquiler = await this.alquilerService.findOneByCode(res.codigo_reserva);
                await this.alquilerService.confirm(alquiler.id, 'Observacion');
                let dto = new ReseñaDto(5, 'Excelente');
                await this.alquilerService.reseñar(alquiler.id, dto, user.id);
            }
            c++;
        }
    }

    async genRandom() {
        const reviewMessages = ['Malo', 'Regular', 'Bueno', 'Muy bueno', 'Excelente'];

        const maquinaria = await this.maquinariaService.findAll({ }, UserRole.Admin);
        if (maquinaria.length === 0) {
            console.log('No hay maquinaria disponible para crear reservas');
            return;
        }


        const users = (await this.userService.findAllByRol(UserRole.Cliente)).filter(user => user.isActive);
        if (users.length === 0) {
            console.log('No hay clientes para crear reservas');
            return;
        }
        for (let i = 0; i < 100; i++) {
            let randomMaquinaria = maquinaria[Math.floor(Math.random() * maquinaria.length)];

            const randomUser = users[Math.floor(Math.random() * users.length)];
            const reserva = new CreateReservaDto();

            reserva.id_maquinaria = randomMaquinaria.id;
            reserva.email = randomUser.email;

            reserva.fecha_inicio = new Date(Date.now() - Math.floor(Math.random() * 90) * 86400000);
            reserva.fecha_fin = new Date(reserva.fecha_inicio.getTime() + (Math.floor(Math.random() * 7) + 1) * 86400000);

            let res = await this.reservaService.create(reserva);
            await this.reservaService.confirmarReserva(res.id);

            const alquiler = await this.alquilerService.findOneByCode(res.codigo_reserva);
            await this.alquilerService.confirm(alquiler.id, 'Observacion');
            let score = Math.floor(Math.random() * 5);

            if (score < 4) score++;

            let dto
            if (Math.random() < 0.5) {
                dto = new ReseñaDto(score, reviewMessages[score]);   
            }
            else {
                dto = new ReseñaDto(score);
            }
            
            await this.alquilerService.reseñar(alquiler.id, dto, randomUser.id);
        }
    }
}
