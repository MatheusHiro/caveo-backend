import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 100,
    })
    name: string

    @Column()
    email: string

    @Column()
    isOnboarded: boolean

    @Column
    createdAt: Date

    @Column
    deletedAt: Date

    @Column
    updatedAt: Date
}