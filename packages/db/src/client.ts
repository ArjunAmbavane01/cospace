import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from "./schemas/index";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const globalForDB = global as typeof globalThis & {
    db: ReturnType<typeof drizzle<typeof schema>>;
}

export const db = globalForDB.db || drizzle(pool, { schema });

if (process.env.NODE_ENV === "production") globalForDB.db = db;