import { MaquinariaStates } from "src/maquinaria/maquinaria.entity";
import { MaquinariaService } from "src/maquinaria/maquinaria.service";
import { PreguntaService } from "src/pregunta/pregunta.service";
import { UserRole } from "src/user/user.entity";
import { UserService } from "src/user/user.service";

export class InitializePreguntas {
    constructor(
        private readonly maquinariaService: MaquinariaService,
        private readonly userService: UserService,
        private readonly preguntaService: PreguntaService
    ) { }
    private readonly HARDCODED_EMAIL = 'cliente@hotmail.com';
    // Relevantes a maquinaria de construccion, agricultura, industriales, etc
    private readonly HARDCODED_PREGUNTAS = [
        "¿Cuánto pesa esta maquinaria?",
        "¿Cuál es la capacidad de carga?",
        "¿Qué tipo de combustible utiliza?",
        "¿Cuál es el consumo de combustible por hora?",
        "¿Qué tipo de mantenimiento requiere?",
        "¿Está disponible para alquiler a largo plazo?",
        "¿Cuáles son las condiciones de entrega y recogida?",
        "¿Qué medidas de seguridad tiene incorporadas?",
        "¿Está asegurada la maquinaria durante el alquiler?",
        "¿Qué tipo de garantía se ofrece?"
    ];

    private readonly HARDCODED_RESPUESTAS = [
        "Ni idea flaco.",
        "Ponele.",
        "No tengo idea, pero te aseguro que va a satisfacer tus necesidades.",
    ];

    async init() {
        const preguntas = await this.preguntaService.findAll();
        if (preguntas.length > 0) return;
        this.genHard();
    }

    async genHard() {
        const maquinarias = await this.maquinariaService.findAll({ state: MaquinariaStates.Disponible }, UserRole.Cliente);
        const user = await this.userService.findOneByEmail(this.HARDCODED_EMAIL);
        if (!user) {
            console.log('No se encontro el usuario');
            return;
        }
        maquinarias.forEach(async maquinaria => {
            const pregunta = this.HARDCODED_PREGUNTAS[Math.floor(Math.random() * this.HARDCODED_PREGUNTAS.length)];
            const pregunta_creada = await this.preguntaService.create(user.id, maquinaria.id, pregunta);
            if (pregunta_creada.id % 2 === 0) {
                await this.preguntaService.answer(pregunta_creada.id, this.HARDCODED_RESPUESTAS[Math.floor(Math.random() * this.HARDCODED_RESPUESTAS.length)]);
            }

        });
    }

}