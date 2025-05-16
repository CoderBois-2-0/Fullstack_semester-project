import { z } from "zod";
import { getDBClient } from "@/db/index";
import { userTable } from "@/db//schema";
import { createSelectSchema } from "drizzle-zod";

const userSelectSchema = createSelectSchema(userTable);
type TUser = z.infer<typeof userSelectSchema>;

class UserHandler {
  #client: ReturnType<typeof getDBClient>;
  #table = userTable;

  constructor(dbUrl: string) {
    this.#client = getDBClient(dbUrl);
  }

  async findUserByEmail(email: string) {
    return this.#client.query.userTable.findFirst({
      where: (user, { eq }) => eq(user.email, email),
    });
  }

  async createUser(newUser: Omit<TUser, "id">) {
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

export { UserHandler, userSelectSchema, TUser };
