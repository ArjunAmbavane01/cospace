import { pgTable, timestamp, serial, integer, uuid } from "drizzle-orm/pg-core";
import { arenas } from "./arena.ts";

export const messageGroups = pgTable("message_groups", {
    id: serial().primaryKey(),
    publicId: uuid("public_id",).defaultRandom().notNull().unique(),
    arenaId: integer("arena_id")
        .notNull()
        .references(() => arenas.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .defaultNow()
        .notNull(),
});