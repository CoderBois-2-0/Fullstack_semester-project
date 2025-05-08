import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('tickets')
class Ticket {
    @PrimaryColumn()
    id: number; 

    @Column()
    price: number;
}

export {
    Ticket
};