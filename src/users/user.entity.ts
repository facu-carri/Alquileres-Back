import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'usuario' })
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    username: string
    
    @Column()
    password: string
}