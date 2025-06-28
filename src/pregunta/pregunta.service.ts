import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Pregunta } from "./pregunta.entity";
import { Maquinaria } from "src/maquinaria/maquinaria.entity";
import { User } from "src/user/user.entity";

@Injectable()
export class PreguntaService {
    constructor(
        @InjectRepository(Pregunta)
        private readonly preguntaRepository: Repository<Pregunta>,
    ) {}

    async create(user_id: number, maquinaria_id: number, query: string): Promise<Pregunta> {
        const maquinaria = await this.preguntaRepository.manager.findOne(Maquinaria, { where: { id: maquinaria_id } });
        if (!maquinaria) {
            throw new NotFoundException('Maquinaria not found');
        }
        const usuario = await this.preguntaRepository.manager.findOne(User, { where: { id: user_id } });
        if (!usuario) {
            throw new NotFoundException('Usuario not found');
        }
        if (!query || query.trim() === '') {
            throw new NotFoundException('La pregunta no puede estar vacía');
        }
        const pregunta = new Pregunta(usuario, maquinaria, query);
        return this.preguntaRepository.save(pregunta);
    }
    async findAll(): Promise<any[]> {
        return this.preguntaRepository
            .createQueryBuilder('pregunta')
            .leftJoin('pregunta.maquinaria', 'maquinaria')
            .addSelect(['maquinaria.id', 'maquinaria.nombre', 'maquinaria.marca', 'maquinaria.modelo'])
            .leftJoin('pregunta.usuario', 'usuario')
            .addSelect(['usuario.id', 'usuario.nombre', 'usuario.email'])
            .getMany();
    }

    async findByMaquinaria(maquinaria_id: number): Promise<any[]> {
        const maquinaria = await this.preguntaRepository.manager.findOne(Maquinaria, { where: { id: maquinaria_id } });        
        if (!maquinaria) {
            throw new NotFoundException('Maquinaria not found');
        }
        return this.preguntaRepository
            .createQueryBuilder('pregunta')
            .leftJoin('pregunta.usuario', 'usuario')
            .addSelect(['usuario.id', 'usuario.nombre', 'usuario.email'])
            .where('maquinariaId = :id_maquinaria', { id_maquinaria: maquinaria.id })
            .getMany();
    }

    async findOne(id: number): Promise<any> {
        const pregunta = await this.preguntaRepository
            .createQueryBuilder('pregunta')
            .leftJoin('pregunta.maquinaria', 'maquinaria')
            .addSelect(['maquinaria.id', 'maquinaria.nombre', 'maquinaria.marca', 'maquinaria.modelo'])
            .leftJoin('pregunta.usuario', 'usuario')
            .addSelect(['usuario.id', 'usuario.nombre', 'usuario.email'])
            .where('pregunta.id = :id', { id })
            .getOne();
        if (!pregunta) throw new NotFoundException('Pregunta not found');
        return pregunta;
    }

    async answer(id: number, respuesta: string): Promise<Pregunta> {
        const pregunta = await this.findOne(id);
        pregunta.respuesta = respuesta;
        pregunta.fecha_respuesta = new Date();
        return this.preguntaRepository.save(pregunta);
    }

    async remove(id: number): Promise<void> {
        const result = await this.preguntaRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Pregunta not found');
        }
    }
}