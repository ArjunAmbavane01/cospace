import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { arenas } from "../arena.ts";
import { user } from "../auth.ts";

export const usersToArenas = pgTable(
    "users_to_arenas",
    {
        userId: text("user_id")
            .notNull()
            .references(() => user.id),
        arenaId: integer("arena_id")
            .notNull()
            .references(() => arenas.id),
    },
    (t) => [
        primaryKey({ columns: [t.userId, t.arenaId] })
    ]
)

// this relations is how usersToArenasRelations relates to the two table 
export const usersToArenasRelations = relations(usersToArenas, ({ one }) => ({
    arena: one(arenas, {
        fields: [usersToArenas.arenaId],
        references: [arenas.id]
    }),
    user: one(user, {
        fields: [usersToArenas.userId],
        references: [user.id]
    })
}))