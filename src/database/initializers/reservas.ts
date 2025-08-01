import { ReservaService } from "src/reserva/reserva.service";
import { MaquinariaService } from "src/maquinaria/maquinaria.service";
import { UserRole } from "src/user/user.entity";
import { CreateReservaDto } from "src/reserva/dto/create-reserva.dto";
import { UserService } from "src/user/user.service";
import { MaquinariaStates } from "src/maquinaria/maquinaria.entity";
import { AlquilerService } from "src/alquiler/alquiler.service";
import { ReseñaDto } from "src/alquiler/dto/reseña.dto";
import { Alquiler } from "src/alquiler/alquiler.entity";

export class InitializeReservas {
    private readonly HARDCODED_EMAIL = 'cliente@hotmail.com';
    private readonly DAY_CONSTANT = 86400000; // 24 * 60 * 60 * 1000

    private readonly randomReservaCount = 500;

    constructor(
        private readonly reservaService: ReservaService,
        private readonly maquinariaService: MaquinariaService,
        private readonly userService: UserService,
        private readonly alquilerService: AlquilerService
    ) { }

    async init() {
        const reservas = await this.reservaService.findAll();
        if (reservas.length > 0) return;

        await this.genHard();
        await this.genRandom();
    }

    async genHard() {
        const maquinaria = await this.maquinariaService.findAll({ state: MaquinariaStates.Disponible }, UserRole.Admin);
        const user = await this.userService.findOneByEmail(this.HARDCODED_EMAIL);
        if (!user) {
            console.log('No se encontro el usuario');
            return;
        }
        // Reserva en curso
        const reserva = new CreateReservaDto();
        reserva.id_maquinaria = maquinaria[0].id;
        reserva.email = user.email;
        reserva.fecha_inicio = new Date(Date.now());
        reserva.fecha_fin = new Date(reserva.fecha_inicio.getTime() + this.DAY_CONSTANT * 5);
        await this.reservaService.create(reserva);

        // Alquiler finalizado sin puntuar
        const reserva2 = new CreateReservaDto();
        reserva2.id_maquinaria = maquinaria[1].id;
        reserva2.email = user.email;
        reserva2.fecha_inicio = new Date(Date.now() - this.DAY_CONSTANT * 50);
        reserva2.fecha_fin = new Date(reserva2.fecha_inicio.getTime() + this.DAY_CONSTANT * 5);
        const res = await this.reservaService.create(reserva2);
        await this.reservaService.confirmarReserva(res.id);
        const alquiler = await this.alquilerService.findOneByCode(res.codigo_reserva);
        this.alquilerService.updateFechaInicio(alquiler.id, reserva2.fecha_inicio);
        await this.alquilerService.confirm(alquiler.id);


        // Reserva futura (10 dias)
        const reserva5 = new CreateReservaDto();
        reserva5.id_maquinaria = maquinaria[1].id;
        reserva5.email = user.email;
        reserva5.fecha_inicio = new Date(Date.now() + this.DAY_CONSTANT * 10);
        reserva5.fecha_fin = new Date(reserva5.fecha_inicio.getTime() + this.DAY_CONSTANT * 5);
        await this.reservaService.create(reserva5);

        // Reserva futura (20 dias)
        const reserva6 = new CreateReservaDto();
        reserva6.id_maquinaria = maquinaria[1].id;
        reserva6.email = user.email;
        reserva6.fecha_inicio = new Date(Date.now() + this.DAY_CONSTANT * 25);
        reserva6.fecha_fin = new Date(reserva6.fecha_inicio.getTime() + this.DAY_CONSTANT * 5);
        await this.reservaService.create(reserva6);

        // Alquileres finalizados
        let c = 0;
        for (const element of maquinaria) {
            const reserva = new CreateReservaDto();
            reserva.id_maquinaria = element.id;
            reserva.email = user.email;
            reserva.fecha_inicio = new Date(Date.now() - this.DAY_CONSTANT * 50);
            reserva.fecha_fin = new Date(reserva.fecha_inicio.getTime() + this.DAY_CONSTANT * 5);
            const res = await this.reservaService.create(reserva);
            await this.reservaService.confirmarReserva(res.id);
            const alquiler = await this.alquilerService.findOneByCode(res.codigo_reserva);
            this.alquilerService.updateFechaInicio(alquiler.id, reserva.fecha_inicio);

            // 10% con comentario
            if (Math.random() < 0.1) {
                await this.alquilerService.confirm(alquiler.id, 'Revisar cubiertas');
            }
            else await this.alquilerService.confirm(alquiler.id);

            // 50% con puntuacion
            if (c % 2 === 0) {
                let dto = new ReseñaDto(5, 'Excelente');
                let res = await this.alquilerService.reseñar(alquiler.id, dto, user.id);
                this.alquilerService.updateFechaReseña(res.id, alquiler.fecha_fin);
            }
            c++;
        }
        // test reserva vencida
        const reserva3 = new CreateReservaDto();

        reserva3.id_maquinaria = maquinaria[0].id;
        reserva3.email = user.email;

        reserva3.fecha_inicio = new Date(Date.now() - this.DAY_CONSTANT * 10);
        reserva3.fecha_fin = new Date(reserva3.fecha_inicio.getTime() + 86400000);

        await this.reservaService.create(reserva3);

        // test alquiler retrasado
        const reserva4 = new CreateReservaDto();

        reserva4.id_maquinaria = maquinaria[0].id;
        reserva4.email = user.email;

        reserva4.fecha_inicio = new Date(Date.now() - this.DAY_CONSTANT * 5);
        reserva4.fecha_fin = new Date(reserva4.fecha_inicio.getTime() + 86400000);
        
        let res4 = await this.reservaService.create(reserva4);
        await this.reservaService.confirmarReserva(res4.id);
        const alquiler4 = await this.alquilerService.findOneByCode(res4.codigo_reserva);
        this.alquilerService.updateFechaInicio(alquiler4.id, reserva4.fecha_inicio);
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
        for (let i = 0; i < this.randomReservaCount; i++) {
            let randomMaquinaria = maquinaria[Math.floor(Math.random() * maquinaria.length)];

            const randomUser = users[Math.floor(Math.random() * users.length)];
            const reserva = new CreateReservaDto();

            reserva.id_maquinaria = randomMaquinaria.id;
            reserva.email = randomUser.email;

            reserva.fecha_inicio = new Date(Date.now() - Math.floor(Math.random() * 365) * this.DAY_CONSTANT - 7 * this.DAY_CONSTANT);
            reserva.fecha_fin = new Date(reserva.fecha_inicio.getTime() + (Math.floor(Math.random() * 7) + 1) * this.DAY_CONSTANT);

            let res = await this.reservaService.create(reserva);
            await this.reservaService.confirmarReservaHard(res.id);

            const alquiler = await this.alquilerService.findOneByCode(res.codigo_reserva);
            this.alquilerService.updateFechaInicio(alquiler.id, reserva.fecha_inicio);

            if (Math.random() < 0.1) {
                await this.alquilerService.confirm(alquiler.id, 'Revisar cubiertas');
            }
            else await this.alquilerService.confirm(alquiler.id);

            await this.alquilerService.confirm(alquiler.id);
            let score = Math.floor(Math.random() * 5);

            if (score < 4) score++;

            let dto
            if (Math.random() < 0.5) {
                dto = new ReseñaDto(score, reviewMessages[score-1]);   
            }
            else {
                dto = new ReseñaDto(score);
            }
            
            let reseña = await this.alquilerService.reseñar(alquiler.id, dto, randomUser.id);
            this.alquilerService.updateFechaReseña(reseña.id, alquiler.fecha_fin);
        }
    }
}
