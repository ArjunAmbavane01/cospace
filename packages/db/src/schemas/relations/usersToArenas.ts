import { relations } from "drizzle-orm";
import { index, integer, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { arenas } from "../arena";
import { user } from "../auth";

export const usersToArenas = pgTable(
    "users_to_arenas",
    {
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        arenaId: integer("arena_id")
            .notNull()
            .references(() => arenas.id, { onDelete: "cascade" }),
    },
    (t) => [
        primaryKey({ columns: [t.userId, t.arenaId] }),
        index("idx_uta_user_id").on(t.userId),
        index("idx_uta_arena_id").on(t.arenaId),
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