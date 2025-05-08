import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('posts')
class Post {
    @PrimaryColumn()
    id: string; 

    @Column()
    title: string;

    @Column()
    text: string;

    @Column()
    createdAt: Date;
}

export {
    Post
};