import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
    
@Entity({ name: 'reservas' })
export class Reserva {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    maquinariaId: string

    @Column({ nullable: false })
    startDate: string
    
    @Column({ nullable: false })
    endDate: string

    @Column()
    userId: string
}