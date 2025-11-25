import { pgTable, timestamp, serial, integer, uuid, index } from "drizzle-orm/pg-core";
import { arenas } from "./arena";

export const messageGroups = pgTable("message_groups", {
    id: serial().primaryKey(),
    publicId: uuid("public_id",).defaultRandom().notNull().unique(),
    arenaId: integer("arena_id")
        .notNull()
        .references(() => arenas.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => new Date())
        .defaultNow()
        .notNull(),
}, (t) => [
    index("idx_arena_id").on(t.arenaId),
]);