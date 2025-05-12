import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

let db: null | ReturnType<typeof connect> = null;

function connect(dbUrl: string) {
  return drizzle(dbUrl, { schema });
}

function getDBClient(dbUrl: string) {
  if (!db) {
    db = connect(dbUrl);
  }

  return db;
}

export { getDBClient };
