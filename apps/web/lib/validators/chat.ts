import { z } from "zod";
import { Message } from "@repo/schemas/arena-ws-events";
import { InfiniteData } from "@tanstack/react-query";

export const chatGroupParticipant = z.object({
    id: z.string(),
    name: z.string(),
    image: z.nullish(z.string()),
    isOnline: z.boolean().default(false),
})

export const chatGroupSchema = z.object({
    createdAt: z.date(),
    updatedAt: z.date(),
    publicId: z.string(),
    lastMessage: z.nullable(z.object({
        content: z.string().optional(),
        createdAt: z.date()
    })),
    participants: chatGroupParticipant.array(),
})

export interface MessagePage {
    rows: Message[];
}
export type MessagesInfiniteData = InfiniteData<MessagePage, number>;

export type ChatGroup = z.infer<typeof chatGroupSchema>;
export type ChatGroupParticipant = z.infer<typeof chatGroupParticipant>;