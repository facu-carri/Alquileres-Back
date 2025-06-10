import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Maquinaria } from "src/maquinaria/maquinaria.entity";
import { User } from "src/user/user.entity";

@Entity({ name: 'preguntas' })
export class Pregunta {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    pregunta: string;

    @Column({ nullable: true })
    respuesta?: string;

    @CreateDateColumn()
    fecha_pregunta: Date;

    @UpdateDateColumn({ nullable: true })
    fecha_respuesta?: Date;

    @ManyToOne(() => Maquinaria, maquinaria => maquinaria.preguntas)
    maquinaria: Maquinaria;

    @ManyToOne(() => User)
    usuario: User;
}