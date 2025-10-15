import { pgTable, text, timestamp, serial, varchar, integer } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { messageGroups } from "./messageGroup";

export const messages = pgTable("messages", {
    id: serial().primaryKey(),
    messageGroupId: integer("message_group_id")
        .notNull()
        .references(() => messageGroups.id),
    senderId: text("sender_id")
        .notNull()
        .references(() => user.id),
    recieverId: text("reciever_id")
        .notNull()
        .references(() => user.id),
    content: varchar("content", { length: 512 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});