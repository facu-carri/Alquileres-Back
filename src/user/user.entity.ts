import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export type UserRoles = 'cliente' | 'empleado' | 'admin'

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    email: string

    @Column({ nullable: false })
    nombre: string

    @Column()
    apellido: string
    
    @Column({ nullable: false })
    password: string

    @Column({ nullable: false, default: 'client' })
    rol: UserRoles

    @Column({ nullable: true })
    telefono: string

    @Column()
    dni: string

    @Column()
    nacimiento: string
}
