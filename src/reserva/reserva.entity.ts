import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Sucursal } from "src/utils/enums";
import { Politica } from "src/utils/enums";
import { Maquinaria } from "src/maquinaria/maquinaria.entity";
import { User } from "src/user/user.entity";
import { ManyToOne, JoinColumn } from "typeorm";

// Activa -> Cancelada -> Finalizada
// Activa -> Finalizada
// Finalizada implica que no quedan operaciones pendientes
// Cancelada implica que hay que hacer una devolucion
export enum ReservaStates {
    Activa = 'Activa',
    Cancelada = 'Cancelada',
    Finalizada = 'Finalizada',
    Reembolsada = 'Reembolsada',
    Vencida = 'Vencida'
}

@Entity({ name: 'reservas' })
export class Reserva {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false, unique: true })
    codigo_reserva: string

    @ManyToOne(() => Maquinaria, { nullable: false })
    @JoinColumn({ name: 'id_maquinaria' })
    maquinaria: Maquinaria

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'id_usuario' })
    usuario: User

    @Column({ nullable: false })
    fecha_inicio: Date

    @Column({ nullable: false })
    fecha_fin: Date

    @Column({ nullable: false })
    precio_dia: number

    @Column({ nullable: false })
    precio_total: number

    @Column({ 
        type: 'enum',
        enum: Sucursal,
        default: Sucursal.LaPlata,
        nullable: false
    })
    sucursal: Sucursal

    @Column({ 
        type: 'enum',
        enum: Politica,
        default: Politica.devolucion_100,
        nullable: false
    })
    politica: Politica

    @Column({ 
        type: 'enum',
        enum: ReservaStates,
        default: ReservaStates.Activa,
        nullable: false
    })
    estado: ReservaStates
}