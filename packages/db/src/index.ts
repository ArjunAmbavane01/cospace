import 'dotenv/config';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

const globalForDrizzle = global as unknown as { drizzle: NeonHttpDatabase };

export const db = globalForDrizzle.drizzle || drizzle({ client: sql });

if (process.env.NODE_ENV !== "production") globalForDrizzle.drizzle = db;