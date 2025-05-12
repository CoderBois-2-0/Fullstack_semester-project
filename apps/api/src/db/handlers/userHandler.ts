import { getDBClient } from "@/db/index";
import { userTable } from "@/db//schema";

type TUser = typeof userTable.$inferInsert;

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

    const usersInserted = await this.#client.insert(this.#table).values({
      ...newUser,
      id: userId,
    }).returning();

    return usersInserted.at(0);
  }
}

export { UserHandler, TUser };
