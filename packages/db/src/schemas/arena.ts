import { pgTable, text, timestamp, serial, varchar } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const arenas = pgTable("arenas", {
    id: serial().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    adminId: text("admin_id")
        .notNull()
        .references(() => user.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});