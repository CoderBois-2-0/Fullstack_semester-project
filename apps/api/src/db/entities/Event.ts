import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('events')
class Event {
    @PrimaryColumn()
    id: string; 

    @Column()
    name: string

    @Column()
    location: string

    @Column()
    startDate: Date

    @Column()
    endDate: Date
}

export {
    Event
};