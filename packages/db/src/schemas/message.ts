import { pgTable, text, timestamp, serial, varchar, integer } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { messageGroups } from "./messageGroup";

export const messages = pgTable("messages", {
    id: serial().primaryKey(),
    messageGroupId: integer("message_group_id")
        .notNull()
        .references(() => messageGroups.id, { onDelete: "cascade" }),
    senderId: text("sender_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    content: varchar("content", { length: 512 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});