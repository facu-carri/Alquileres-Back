import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { Maquinaria } from "src/maquinaria/maquinaria.entity";
import { User } from "src/user/user.entity";
import { Reseña } from "src/alquiler/reseña.entity";
import { Sucursal } from "src/utils/enums";
import { Reserva } from "src/reserva/reserva.entity";

export enum AlquilerStates {
    Activo = 'Activo',
    Finalizado = 'Finalizado',
    Retrasado = 'Retrasado'
}

@Entity({ name: 'alquileres' })
export class Alquiler {

    constructor( reserva?: Reserva, estado? : AlquilerStates ) 
    {
        if (reserva){ 
            this.maquinaria = reserva.maquinaria;
            this.codigo_reserva = reserva.codigo_reserva;
            this.usuario = reserva.usuario;
            this.fecha_inicio = new Date();
            this.fecha_fin = reserva.fecha_fin;
            this.sucursal = reserva.sucursal;      
            this.precio = reserva.precio_total; 
            this.precio_dia = reserva.precio_dia; 
        }
        this.estado = estado || AlquilerStates.Activo;
    }

    calcularDeuda(): number {
        if (this.estado !== AlquilerStates.Retrasado) return 0;
        let dias = Math.ceil((new Date().getTime() - this.fecha_fin.getTime()) / (1000 * 60 * 60 * 24)); 
        let deuda = this.precio_dia * dias * 1.5;
        return deuda;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    codigo_reserva: string

    @Column({ name: 'id_usuario' })
    usuarioId: number;

    @Column({ name: 'id_maquinaria' })
    maquinariaId: number;

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
    precio_dia: number;

    @Column({ nullable: false })
    precio: number;

    @Column({ 
        type: 'enum',
        enum: Sucursal,
        default: Sucursal.LaPlata,
        nullable: false 
    })
    sucursal: Sucursal;

    @Column({
        type: 'enum',
        enum: AlquilerStates,
        default: AlquilerStates.Activo,
        nullable: false
    })
    estado: AlquilerStates;

    @Column({ nullable: true })
    observacion?: string;

    @OneToOne(() => Reseña, reseña => reseña.alquiler, { cascade: true, nullable: true })
    resenia?: Reseña;

    @Column({ nullable: false, default: 0 })
    deuda?: number
}