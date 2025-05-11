import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'cliente' })
export class Client {
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
}