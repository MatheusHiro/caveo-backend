import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm"

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  role: string;

  @Column({ default: false })
  isOnboarded: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  constructor(
    id: number,
    email: string,
    name: string,
    role: string,
    isOnboarded: boolean,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.role = role;
    this.isOnboarded = isOnboarded;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}

export interface UserCredentials {
  name: string
  email: string
}