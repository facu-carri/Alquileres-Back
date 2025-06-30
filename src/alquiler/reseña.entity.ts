import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, CreateDateColumn } from "typeorm";
import { Alquiler } from "./alquiler.entity";
import { User } from "src/user/user.entity";
import { Maquinaria } from "src/maquinaria/maquinaria.entity";

@Entity({ name: 'reseñas' })
export class Reseña {

    constructor(usuario?: User, alquiler?: Alquiler, puntaje?: number, comentario?: string) {
        if (alquiler) this.alquiler = alquiler;
        if (usuario) this.autor = usuario;
        if (puntaje) this.puntaje = puntaje;
        if (comentario) this.comentario = comentario;
        this.likes = 0;
        this.fecha = new Date();
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    comentario?: string;

    @Column({ type: 'float', nullable: true })
    puntaje?: number;

    @Column({ default: 0 })
    likes: number;

    @OneToOne(() => Alquiler, alquiler => alquiler.reseña, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'alquiler_id' })
    alquiler: Alquiler;
    
    @Column({ name: 'maquinaria_id' })
    maquinariaId: number;

    @ManyToOne(() => Maquinaria , maquinaria => maquinaria.reseñas, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'maquinaria_id' })
    maquinaria: Partial<Maquinaria>;

    @Column({ name: 'autor_id' })
    autorId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'autor_id' })
    autor: Partial<User>;

    @CreateDateColumn()
    fecha: Date;

    @Column({ default: false })
    eliminado: boolean;
}