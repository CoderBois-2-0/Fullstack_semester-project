import { defineConfig } from "drizzle-kit";

const DIRECT_DB_URL = process.env.DB_URL || 'No DB url';

export default defineConfig({
    dialect: 'postgresql',
    schema: './src/db/schema.ts',
    out: './drizzle',
    dbCredentials: {
        url: DIRECT_DB_URL
    }
})