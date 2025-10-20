import { Pool } from '@neondatabase/serverless';
import { drizzle, NeonDatabase } from 'drizzle-orm/neon-serverless';
import * as schema from "./schemas/index";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const globalForDB = global as typeof globalThis & {
    db: NeonDatabase<typeof schema>;
}

export const db: NeonDatabase<typeof schema> = globalForDB.db ?? drizzle(pool, { schema });

if (process.env.NODE_ENV !== "production") globalForDB.db = db;