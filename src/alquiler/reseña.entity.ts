import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, CreateDateColumn } from "typeorm";
import { Alquiler } from "./alquiler.entity";
import { User } from "src/user/user.entity";

@Entity({ name: 'reseñas' })
export class Reseña {
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

    @ManyToOne(() => User)
    autor: User;

    @CreateDateColumn()
    fecha: Date;

    @Column({ default: false })
    eliminado: boolean;
}