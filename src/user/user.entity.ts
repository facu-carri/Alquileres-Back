import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
  Cliente = 'cliente',
  Empleado = 'empleado',
  Admin = 'admin',
}

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
    rol: UserRole

    @Column({ nullable: true })
    telefono: string

    @Column()
    dni: string

    @Column()
    nacimiento: string

    @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    fecha: Date;

    @Column({ nullable: false, default: true })
    isActive: boolean
}
