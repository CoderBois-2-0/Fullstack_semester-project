import { Column, Entity, PrimaryColumn } from "typeorm";

export enum UserRole {
    ADMIN = "admin",
    ORGANISER = "organiser",
}

@Entity('users')
class User {
    @PrimaryColumn()
    id: string; 

    @Column({ type: 'enum', enum: UserRole })
    role: UserRole;

    @Column()
    username: string

    @Column()
    email: string

    @Column()
    password: string
}

export {
    User
};