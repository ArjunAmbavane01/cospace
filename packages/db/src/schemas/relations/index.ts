import { relations } from "drizzle-orm";
import { user } from "../auth.ts";
import { arenas } from "../arena.ts";
import { messageGroups } from "../messageGroup.ts";
import { messages } from "../message.ts";
import { usersToArenas } from "./usersToArenas.ts";
import { usersToMessageGroups } from "./usersToMessageGroups.ts";

// User Relations
export const usersRelations = relations(user, ({ many }) => ({
    // user can be in many arenas
    usersToArenas: many(usersToArenas),
    // user can be in many message groups
    usersToMessageGroups: many(usersToMessageGroups),
}))

// Arena Relations
export const arenasRelations = relations(arenas, ({ many }) => ({
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