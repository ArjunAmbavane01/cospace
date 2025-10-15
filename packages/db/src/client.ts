import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "./schemas/index";

const sql = neon(process.env.DATABASE_URL!);

const globalForDB = global as typeof globalThis & {
    db: ReturnType<typeof drizzle<typeof schema>>;
}

export const db = globalForDB.db || drizzle({ client: sql, schema });

if (process.env.NODE_ENV === "production") globalForDB.db = db;