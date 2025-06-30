import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Sucursal, Categoria } from "src/utils/enums";
import { Politica } from "src/utils/enums";
import { Pregunta } from "src/pregunta/pregunta.entity";
import { Alquiler } from "src/alquiler/alquiler.entity";
import { Reserva } from "src/reserva/reserva.entity";
import { Expose } from "class-transformer";
import { Reseña } from "src/alquiler/reseña.entity";

export enum MaquinariaStates {
    Disponible = 'Disponible',
    Mantenimiento = 'Mantenimiento',
    Eliminado = 'Eliminado'
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
        enum: Sucursal,
        default: Sucursal.LaPlata,
        nullable: false 
    })
    sucursal: Sucursal

    @Column({ 
        type: 'enum',
        enum: Categoria,
        default: Categoria.Otro,
        nullable: false 
    })
    categoria: Categoria

    @Column({ 
        type: 'enum',
        enum: MaquinariaStates,
        default: MaquinariaStates.Disponible,
        nullable: false 
    })
    state: MaquinariaStates

    @Column({ 
        type: 'enum',
        enum: Politica,
        default: Politica.devolucion_100,
        nullable: false 
    })
    politica: Politica

    @OneToMany(() => Pregunta, pregunta => pregunta.maquinaria)
    preguntas: Pregunta[];

    @OneToMany(() => Reserva, reserva => reserva.maquinaria)
    reservas: Reserva[]

    @OneToMany(() => Alquiler, alquiler => alquiler.maquinaria)
    alquileres: Partial<Alquiler>[]

    @OneToMany(() => Reseña, reseña => reseña.maquinaria)
    reseñas: Partial<Reseña>[];

    puntaje_promedio? : number

    @Expose()
    get averageScore(): number | null {
        if (!this.reseñas || this.reseñas.length === 0) return null;
        const scores = this.reseñas
            .filter(r => r.puntaje && typeof r.puntaje === 'number')
            .map(r => r.puntaje);
        if (scores.length === 0) return null;
        return scores.reduce((a, b) => a + b, 0) / scores.length;
    }
}