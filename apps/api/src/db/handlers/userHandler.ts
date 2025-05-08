import type { User } from "../../../prisma/generated/prisma/index.js";
import { execute } from "@/db/index.js";

const userHandler = {
    findUserByEmail: async (email: string) => {
        return execute(async (client) => {
            return client.user.findFirst({
                where: {
                    email: {
                        equals: email
                    }
                }
            })
        })
    },
    createUser: (newUser: Omit<User, 'id'>) => {
        return execute(async (client) => {
            const userId = crypto.randomUUID();

            const user = { ...newUser, id: userId };
            await client.user.create({ data: user });

            return user;
        });
    }
}

export {
    userHandler
};