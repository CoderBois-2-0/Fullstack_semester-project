import { DataSource } from "typeorm"

import { User } from "./entities/User.js";
import { Event } from "./entities/Event.js";
import { Post } from "./entities/Post.js";
import { Ticket } from "./entities/Ticket.js";

const DB_URL = process.env.DB_URL || 'No DB url found';

const appDataSource = new DataSource({
    type: "postgres",
    url: DB_URL,
    entities: [User],
    synchronize: false,
    logging: false,
});

const usersRepo = appDataSource.getRepository(User)
const eventRepo = appDataSource.getRepository(Event)
const ticketRepo = appDataSource.getRepository(Ticket)
const postRepo = appDataSource.getRepository(Post)

export {
    usersRepo,
    eventRepo,
    ticketRepo,
    postRepo,
};