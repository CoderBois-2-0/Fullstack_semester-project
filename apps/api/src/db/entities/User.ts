import { Entity, PrimaryColumn } from "typeorm";

@Entity('users')
class User {
    @PrimaryColumn()
    id: string; 
}

export {
    User
}