import { DataSource } from "typeorm"
import { User } from "./entities/User.js";

const DB_URL = process.env.DB_URL || 'No DB url found';

const appDataSource = new DataSource({
    type: "postgres",
    url: DB_URL,
    entities: [User],
    synchronize: false,
    logging: false,
});

const usersRepo = appDataSource.getRepository(User)

export {
    usersRepo
};