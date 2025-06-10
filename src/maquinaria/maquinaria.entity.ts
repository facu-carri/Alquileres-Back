import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Location } from "src/utils/enums/location.enum";
import { ReturnPolicy } from "src/utils/enums/return-policy.enum";
import { Pregunta } from "src/pregunta/pregunta.entity";
import { Alquiler } from "src/alquiler/alquiler.entity";
import { Reserva } from "src/reserva/reserva.entity";

export enum MaquinariaStates {
    Disponible = 'Disponible',
    Mantenimiento = 'Mantenimiento',
    Eliminado = 'Eliminado'
}

export enum MaquinariaCategory {
    Jardinería = 'Jardinería',
    Construcción = 'Construcción',
    Agricultura = 'Agricultura',
    Minería = 'Minería',
    Logística = 'Logística',
    Transporte = 'Transporte',
    Otro = 'Otro'
}

@Entity({ name: 'maquinarias' })
export class Maquinaria {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false , unique: true})
    inventario: string

    @Column({ nullable: false })
    nombre: string

    @Column({ nullable: false })
    marca: string

    @Column({ nullable: true })
    imagen: string

    @Column({ nullable: false })
    modelo: string

    @Column({ nullable: false })
    precio: number

    @Column({ nullable: false })
    anio_adquisicion: number

    @Column({ 
        type: 'enum',
        enum: Location,
        default: Location.LaPlata,
        nullable: false 
    })
    sucursal: Location

    @Column({ 
        type: 'enum',
        enum: MaquinariaCategory,
        default: MaquinariaCategory.Otro,
        nullable: false 
    })
    categoria: MaquinariaCategory

    @Column({ 
        type: 'enum',
        enum: MaquinariaStates,
        default: MaquinariaStates.Disponible,
        nullable: false 
    })
    state: MaquinariaStates

    @Column({ 
        type: 'enum',
        enum: ReturnPolicy,
        default: ReturnPolicy.devolucion_100,
        nullable: false 
    })
    politica: ReturnPolicy

    @OneToMany(() => Pregunta, pregunta => pregunta.maquinaria)
    preguntas: Pregunta[];

    @OneToMany(() => Reserva, reserva => reserva.maquinaria)
    reservas: Reserva[]

    @OneToMany(() => Alquiler, alquiler => alquiler.maquinaria)
    alquileres: Alquiler[]
}