import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'recovery_tokens' })
export class RecoveryToken {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    email: string

    @Column()
    token: string
}
