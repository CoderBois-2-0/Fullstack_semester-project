import { getDBClient } from "@/db/index";
import { userTable } from "@/db//schema";
import { createSelectSchema } from "drizzle-zod";
const userSelectSchema = createSelectSchema(userTable);
/**
 * @description A user with no password
 */
const safeUserSelectSchema = userSelectSchema.omit({ password: true });
class UserHandler {
    #client;
    #table = userTable;
    constructor(dbUrl) {
        this.#client = getDBClient(dbUrl);
    }
    /**
     * @description
     * Attempts to find a user by the given email. This user is unsafe and contains their password,
     * so as to allow for sign in.
     * @param email - The email of the user to find
     * @returns A potential user, if any is found
     */
    async unsafeFindUserByEmail(email) {
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
        const unsafeUser = usersInserted.at(0);
        if (unsafeUser) {
            return this.#safeTransform(unsafeUser);
        }
        return unsafeUser;
    }
    /**
     * Transforms an user to a safe user
     */
    #safeTransform(unsafeUser) {
        const { password: _password, ...safeUser } = unsafeUser;
        return safeUser;
    }
}
export { UserHandler, safeUserSelectSchema };
