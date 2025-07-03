import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Alquiler, AlquilerStates } from "./alquiler.entity";
import { FindManyOptions, Not, Repository } from "typeorm";
import { Reseña } from "./reseña.entity";
import { User, UserRole } from "src/user/user.entity";
import { ReseñaDto } from "./dto/reseña.dto";
import { FilterAlquilerDto } from "./dto/filter-alquiler.dto";

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

    async findAll(filters?: Partial<FilterAlquilerDto>, rol?: UserRole): Promise<Alquiler[]> {
        const queryBuilder = this.alquilerRepository.createQueryBuilder('alquiler')
            .leftJoinAndSelect('alquiler.maquinaria', 'maquinaria')
            .leftJoin('alquiler.usuario', 'usuario')
            .leftJoinAndSelect('alquiler.resenia', 'resenia')
            .addSelect(['usuario.id', 'usuario.email', 'usuario.nombre']);

        const validStates = this.getValidStates();
        queryBuilder.andWhere('alquiler.estado IN (:...validStates)', { validStates });

        if (filters) {
            if (filters.id) queryBuilder.andWhere('alquiler.id = :id', { id: filters.id });
            if (filters.codigo_reserva) queryBuilder.andWhere('alquiler.codigo_reserva = :codigo_reserva', { codigo_reserva: filters.codigo_reserva });
            if (filters.estado) queryBuilder.andWhere('alquiler.estado = :estado', { estado: filters.estado });
            if (filters.user_id) queryBuilder.andWhere('alquiler.id_usuario = :user_id', { user_id: filters.user_id });
            if (filters.user_email) queryBuilder.andWhere('usuario.email = :user_email', { user_email: filters.user_email });
            if (filters.maquinaria_id) queryBuilder.andWhere('alquiler.id_maquinaria = :maquinaria_id', { maquinaria_id: filters.maquinaria_id });
            if (filters.maquinaria_inventario) queryBuilder.andWhere('maquinaria.inventario = :maquinaria_inventario', { maquinaria_inventario: filters.maquinaria_inventario });
        }

        return queryBuilder.getMany();
    }

    async find(opts?: FindManyOptions<Alquiler>): Promise<Array<Alquiler>> {
        return await this.alquilerRepository.find(opts)
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
            where: { id: id },
            relations: ['usuario', 'maquinaria', 'resenia'],
        });
        
        if (!alquiler) {
            throw new NotFoundException('Alquiler not found');
        }
        const user = await this.userRepository.findOne({
            where: { id: user_id },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (alquiler.resenia) {
            throw new BadRequestException('Alquiler ya tiene reseña');
        }
        if (alquiler.estado !== AlquilerStates.Finalizado) {
            throw new BadRequestException('El Alquiler no está Finalizado');
        }
        
        if (user.id !== alquiler.usuarioId) {
            throw new BadRequestException('No tenés permiso para reseñar');
        }

        const reseña = new Reseña(user, alquiler, reseñaDto.puntaje);
        if (reseñaDto.comentario) {
            reseña.comentario = reseñaDto.comentario;
        }

        reseña.maquinaria = alquiler.maquinaria;
        reseña.autor = alquiler.usuario;

        await this.reseñaRepository.save(reseña);

        return reseña;
    }

    // Funcion para programar ejemplos
    async updateFechaInicio(id: number, fecha_inicio: Date): Promise<void> {
        const alquiler = await this.alquilerRepository.findOneBy({ id });
        if (!alquiler) {
            throw new NotFoundException('Alquiler not found');
        }
        alquiler.fecha_inicio = fecha_inicio;
        await this.alquilerRepository.save(alquiler);
    }

    async updateFechaReseña (id: number, fecha: Date): Promise<void> {
        const res = await this.reseñaRepository.findOneBy({ id });
        if (!res) {
            throw new NotFoundException('Alquiler not found');
        }
        res.fecha = fecha;
        await this.reseñaRepository.save(res);
    }

    getValidStates(): string[] {
        return Object.values(AlquilerStates);
    }
}