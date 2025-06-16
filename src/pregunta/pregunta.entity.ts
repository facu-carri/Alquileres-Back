import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Maquinaria } from "src/maquinaria/maquinaria.entity";
import { User } from "src/user/user.entity";

@Entity({ name: 'preguntas' })
export class Pregunta {
    constructor(usuario?: User, maquinaria?: Maquinaria, pregunta?: string) {
        this.pregunta = pregunta;
        this.maquinaria = maquinaria;
        this.usuario = usuario;
        this.fecha_pregunta = new Date();
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    pregunta: string;

    @Column({ nullable: true })
    respuesta?: string;

    @Column({ type: 'timestamp' })
    fecha_pregunta: Date;

    @Column({ type: 'timestamp', nullable: true, default: null })
    fecha_respuesta?: Date;

    @ManyToOne(() => Maquinaria, maquinaria => maquinaria.preguntas)
    maquinaria: Maquinaria;

    @ManyToOne(() => User)
    usuario: User;
}