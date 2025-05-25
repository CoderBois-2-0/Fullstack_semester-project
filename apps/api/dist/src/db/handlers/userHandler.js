import { getDBClient } from "@/db/index";
import { userTable } from "@/db//schema";
import { createSelectSchema } from "drizzle-zod";
const userSelectSchema = createSelectSchema(userTable);
class UserHandler {
    #client;
    #table = userTable;
    constructor(dbUrl) {
        this.#client = getDBClient(dbUrl);
    }
    async findUserByEmail(email) {
        return this.#client.query.userTable.findFirst({
            where: (user, { eq }) => eq(user.email, email),
        });
    }
    async createUser(newUser) {
        const userId = crypto.randomUUID();
        const usersInserted = await this.#client
            .insert(this.#table)
            .values({
            ...newUser,
            id: userId,
        })
            .returning();
        return usersInserted.at(0);
    }
}
export { UserHandler, userSelectSchema };
