import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum MaquinariaStates {
    Disponible = 'Disponible',
    Mantenimiento = 'Mantenimiento',
    Eliminado = 'Eliminado'
}

export enum ReturnPolicy {
    devolucion_0 = '0%',
    devolucion_20 = '20%',
    devolucion_100 = '100%'
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

export enum Location {
    LaPlata = 'La Plata',
    Tandil = 'Tandil',
    Ensenada = 'Ensenada',
    BahíaBlanca = 'Bahía Blanca'
}

@Entity({ name: 'maquinarias' })
export class Maquinaria {
    @PrimaryGeneratedColumn()
    id: number

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
}