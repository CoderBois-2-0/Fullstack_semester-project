import { z } from "zod";
import { getDBClient } from "@/db/index";
import { stribeCustomerTable, userTable } from "@/db//schema";
import { createSelectSchema } from "drizzle-zod";
import StribeHandler from "@/stribe";

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
  #customerHandler: UserCustomerHandler;

  constructor(dbUrl: string, stribeSecretKey: string) {
    this.#client = getDBClient(dbUrl);
    this.#customerHandler = new UserCustomerHandler(dbUrl, stribeSecretKey);
  }

  /**
   * @description
   * A functions that allows for viewing users
   * @returns A list of all users
   */
  async getUsers(): Promise<TSafeUser[]> {
    return this.#client.query.userTable.findMany({
      columns: {
        password: false,
      },
    });
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

    const unsafeUser = await this.#client.transaction(async (tx) => {
      const usersInserted = await tx
        .insert(this.#table)
        .values({
          ...newUser,
          id: userId,
        })
        .returning();

      const user = usersInserted.at(0);
      if (!user) {
        return undefined;
      }

      // we only create a customer in stribe for guests
      if (user.role !== "GUEST") {
        return user;
      }

      const wasCustomerCreated = await this.#customerHandler.createCustomer(
        user
      );
      if (!wasCustomerCreated) {
        tx.rollback();

        return undefined;
      }

      return user;
    });

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

class UserCustomerHandler {
  #client: ReturnType<typeof getDBClient>;
  #table = stribeCustomerTable;
  #stribeHandler: StribeHandler;

  constructor(dbUrl: string, stribeSecretKey: string) {
    this.#client = getDBClient(dbUrl);
    this.#stribeHandler = new StribeHandler(stribeSecretKey);
  }

  async createCustomer(user: TSafeUser): Promise<boolean> {
    const customerId = await this.#stribeHandler.createCustomer(user);

    const customersReturned = await this.#client
      .insert(this.#table)
      .values({ userId: user.id, stribeCustomerId: customerId })
      .returning();

    return customersReturned.at(0) !== undefined;
  }
}

export {
  UserHandler,
  UserCustomerHandler,
  safeUserSelectSchema,
  TUser,
  TSafeUser,
};
