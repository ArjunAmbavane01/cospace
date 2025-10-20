import { relations } from "drizzle-orm";
import { session, user } from "../auth";
import { arenas } from "../arena";
import { messageGroups } from "../messageGroup";
import { messages } from "../message";
import { usersToArenas } from "./usersToArenas";
import { usersToMessageGroups } from "./usersToMessageGroups";

// User Relations
export const usersRelations = relations(user, ({ many }) => ({
    // user can be in many arenas
    usersToArenas: many(usersToArenas),
    // user can be in many message groups
    usersToMessageGroups: many(usersToMessageGroups),
}))

// Arena Relations
export const arenasRelations = relations(arenas, ({ one, many }) => ({
    admin: one(user, {
        fields: [arenas.adminId],
        references: [user.id],
    }),
    // arena can be in many users
    usersToArenas: many(usersToArenas),
    // arena can be in many message groups
    messageGroups: many(messageGroups),
}))

// Message Group Relations
export const messageGroupsRelations = relations(messageGroups, ({ one, many }) => ({
    // message group can be in many users
    usersToGroups: many(usersToMessageGroups),
    // message group can only be in one arena
    arena: one(arenas, {
        fields: [messageGroups.arenaId],
        references: [arenas.id],
    }),
    messages: many(messages)
}));

// Message Relations
export const messagesRelations = relations(messages, ({ one }) => ({
    // message can only be in one messageGroup
    messageGroup: one(messageGroups, {
        fields: [messages.messageGroupId],
        references: [messageGroups.id],
    }),
}));

// Session Relations
export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    })
}))