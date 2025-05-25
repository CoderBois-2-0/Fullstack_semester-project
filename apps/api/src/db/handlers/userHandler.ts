import { z } from "zod";
import { getDBClient } from "@/db/index";
import { userTable } from "@/db//schema";
import { createSelectSchema } from "drizzle-zod";

const userSelectSchema = createSelectSchema(userTable);
type TUser = z.infer<typeof userSelectSchema>;

/**
 * @description A user with no password
 */
const safeUserSelectSchema = userSelectSchema.omit({ password: true });
type TSafeUser = z.infer<typeof safeUserSelectSchema>;

class UserHandler {
  #client: ReturnType<typeof getDBClient>;
  #table = userTable;

  constructor(dbUrl: string) {
    this.#client = getDBClient(dbUrl);
  }

  /**
   * @description
   * Attempts to find a user by the given email. This user is unsafe and contains their password,
   * so as to allow for sign in.
   * @param email - The email of the user to find
   * @returns A potential user, if any is found
   */
  async unsafeFindUserByEmail(email: string): Promise<TUser | undefined> {
    return this.#client.query.userTable.findFirst({
      where: (user, { eq }) => eq(user.email, email),
    });
  }

  async createUser(newUser: Omit<TUser, "id">): Promise<TSafeUser | undefined> {
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
  #safeTransform(unsafeUser: TUser): TSafeUser {
    const { password: _password, ...safeUser } = unsafeUser;

    return safeUser;
  }
}

export { UserHandler, safeUserSelectSchema, TUser, TSafeUser };
