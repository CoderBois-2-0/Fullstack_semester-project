import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";
/**
 * @description
 * The drizzle db client, used for retaining a single client
 */
let db = null;
/**
 * @param dbUrl - The url used to connect to the database
 * @returns A drizzle database client
 */
function connect(dbUrl) {
    return drizzle(dbUrl, { schema });
}
/**
 * @description
 * Retrieves the db client, will connect if the client is not already connected to the database
 * @param dbUrl - The url used to connect to the database
 * @returns The drizzle db client
 */
function getDBClient(dbUrl) {
    if (!db) {
        db = connect(dbUrl);
    }
    return db;
}
export { getDBClient };
