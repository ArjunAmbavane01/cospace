import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

const globalForDb = global as unknown as { drizzle: NeonHttpDatabase };

export const db = globalForDb.drizzle || drizzle({ client: sql });

if (process.env.NODE_ENV !== "production") globalForDb.drizzle = db;