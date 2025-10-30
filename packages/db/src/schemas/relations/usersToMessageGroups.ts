import { relations } from "drizzle-orm";
import { index, integer, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { user } from "../auth";
import { messageGroups } from "../messageGroup";

export const usersToMessageGroups = pgTable(
    "users_to_message_groups",
    {
        userId: text("user_id")
            .notNull()
            .references(() => user.id),
        messageGroupId: integer("message_group_id")
            .notNull()
            .references(() => messageGroups.id),
    },
    (t) => [
        primaryKey({ columns: [t.userId, t.messageGroupId] }),
        index("idx_user_id").on(t.userId),
        index("idx_message_group_id").on(t.messageGroupId)
    ]
)

export const usersToMessageGroupsRelations = relations(usersToMessageGroups, ({ one }) => ({
    messageGroup: one(messageGroups, {
        fields: [usersToMessageGroups.messageGroupId],
        references: [messageGroups.id]
    }),
    user: one(user, {
        fields: [usersToMessageGroups.userId],
        references: [user.id]
    })
}))