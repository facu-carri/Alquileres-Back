import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ReturnPolicy } from "src/maquinaria/maquinaria.entity";
import { Maquinaria } from "src/maquinaria/maquinaria.entity";
import { User } from "src/user/user.entity";
import { ManyToOne, JoinColumn } from "typeorm";

@Entity({ name: 'reservas' })
export class Reserva {
    @PrimaryGeneratedColumn()
    id: number

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

    @Column({ 
        type: 'enum',
        enum: ReturnPolicy,
        default: ReturnPolicy.devolucion_100,
        nullable: false
    })
    politica: ReturnPolicy
}