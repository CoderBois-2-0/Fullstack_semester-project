import { PrismaClient } from "../../prisma/generated/prisma/index.js";
import { PrismaNeon } from '@prisma/adapter-neon'

const DATABASE_URL = process.env.DB_URL || 'No DB url found';

const adapter = new PrismaNeon({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({ adapter })

function execute<T>(fn: (prisma: PrismaClient) => T) {
    return fn(prisma);
}

export {
    execute
};