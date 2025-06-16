import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Alquiler, AlquilerStates } from "./alquiler.entity";
import { Repository } from "typeorm";
import { Reseña } from "./reseña.entity";
import { User } from "src/user/user.entity";
import { ReseñaDto } from "./dto/reseña.dto";

@Injectable()
export class AlquilerService {
    constructor (
        @InjectRepository(Alquiler)
        private readonly alquilerRepository: Repository<Alquiler>,
        @InjectRepository(Reseña)
        private readonly reseñaRepository: Repository<Reseña>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findAll(): Promise<Alquiler[]> {
        return await this.alquilerRepository.find();
    }

    async findOne(id: number): Promise<Alquiler> {
        return await this.alquilerRepository.findOneBy({ id });
    }

    async findOneByCode(codigo_reserva: string): Promise<Alquiler> {
        let alquiler = await this.alquilerRepository.findOneBy({ codigo_reserva });
        if (!alquiler) {
            throw new Error('Alquiler not found');
        }
        return alquiler;
    }

    async confirm(id: number, observacion?: string): Promise<Alquiler> {
        const alquiler = await this.alquilerRepository.findOneBy({ id });
        if (!alquiler) {
            throw new Error('Alquiler not found');
        }
        alquiler.estado = AlquilerStates.Finalizado;
        if (observacion && observacion.trim() !== '') {
            alquiler.observacion = observacion;
        }
        return await this.alquilerRepository.save(alquiler);
    }

    async reseñar(id: number, reseñaDto: ReseñaDto, user_id: number): Promise<Reseña> {
        let alquiler = await this.alquilerRepository.findOne({
            where: { id: id}
        });
        
        if (!alquiler) {
            throw new Error('Alquiler not found');
        }
        const user = await this.userRepository.findOne({
            where: { id: user_id },
        });
        if (!user) {
            throw new Error('User not found');
        }

        if (alquiler.reseña) {
            throw new Error('Alquiler ya tiene reseña');
        }
        if (alquiler.estado !== AlquilerStates.Finalizado) {
            throw new Error('El Alquiler no está Finalizado');
        }
        if (user.id !== alquiler.usuarioId) {
            throw new Error('No tenés permiso para reseñar');
        }

        const reseña = new Reseña(user, alquiler, reseñaDto.puntaje);
        if (reseñaDto.comentario) {
            reseña.comentario = reseñaDto.comentario;
        }
        alquiler.reseña = reseña;

        await this.reseñaRepository.save(reseña);
        await this.alquilerRepository.save(alquiler);

        return reseña;
    }

    getValidStates(): string[] {
        return Object.values(AlquilerStates);
    }
}