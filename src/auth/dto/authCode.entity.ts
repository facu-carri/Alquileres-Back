import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'authCodes' })
export class AuthCode {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    email: string

    @Column({ nullable: false })
    code: string
}
