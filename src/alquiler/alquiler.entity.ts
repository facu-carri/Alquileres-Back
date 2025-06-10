import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { Maquinaria } from "src/maquinaria/maquinaria.entity";
import { User } from "src/user/user.entity";
import { Reseña } from "src/alquiler/reseña.entity";

export enum AlquilerStates {
    Activo = 'Activo',
    Finalizado = 'Finalizado'
}

@Entity({ name: 'alquileres' })
export class Alquiler {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Maquinaria, { nullable: false })
    @JoinColumn({ name: 'id_maquinaria' })
    maquinaria: Maquinaria;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'id_usuario' })
    usuario: User;

    @Column({ nullable: false })
    fecha_inicio: Date;

    @Column({ nullable: false })
    fecha_fin: Date;

    @Column({ nullable: false })
    sucursal: string; // Or use enum Location if you prefer

    @Column({
        type: 'enum',
        enum: AlquilerStates,
        default: AlquilerStates.Activo,
        nullable: false
    })
    estado: AlquilerStates;

    @Column({ nullable: true })
    observacion?: string;

    // One-to-one with Reseña (optional)
    @OneToOne(() => Reseña, reseña => reseña.alquiler, { cascade: true, nullable: true })
    reseña?: Reseña;
}