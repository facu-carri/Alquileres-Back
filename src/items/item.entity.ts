import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";

export type ItemStates = 'Disponible' | 'Reservado' | 'Mantenimiento' | 'Eliminado'
export type ReturnPolicy = '0_devolucion' | '20_devolucion' | '100_devolucion'
export type ItemCategory = 'Jardinería' | 'Construcción' | 'Agricultura' | 'Minería' | 'Logística' | 'Transporte' | 'Otro'
export type Location = 'La Plata' | 'Tandil' | 'Ensenada' | 'Bahía Blanca'

@Entity({ name: 'items' })
export class Item {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    nombre: string

    @Column()
    marca: string
    
    @Column()
    modelo: string

    @Column({ nullable: false })
    precio: number

    @Column({ nullable: false })
    año_adquisicion: number

    // @Column({ nullable: false })
    // imagen: string

    // Es probable que estas cuatro las modelemos de otra manera, dado que el Front va a querer hacer consultas de estos listados para hacer la interfaz
    // Mi intuición es hacer una tabla de categorias, una tabla de estados, una tabla de políticas y una tabla de sucursales
    // Alternativamente, puede haber un endpoint para (por ejemplo), mostrar las distintas categorias, y que se base en revisar qué categorías hay en la lista de maquinas 
    // (suena re ineficiente, pero bueh)

    @Column ({ nullable: false, default: 'La Plata' })
    sucursal : Location

    @Column({ nullable: false, default: 'Otro' })
    categoria: ItemCategory

    @Column({ nullable: false, default: 'Disponible' })
    state: ItemStates

    @Column({ nullable: false, default: '100_devolucion' })
    politica: ReturnPolicy
}
