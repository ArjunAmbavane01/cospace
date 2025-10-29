import { z } from "zod";

export const chatGroupParticipant = z.object({
    id: z.string(),
    name: z.string(),
    image: z.nullish(z.string()),
})

export const chatGroupSchema = z.object({
    createdAt: z.date(),
    updatedAt: z.date(),
    publicId: z.string(),
    lastMessage: z.object({
        content: z.string().optional(),
        createdAt: z.date()
    }).optional(),
    participants: chatGroupParticipant.array(),
})

export type ChatGroup = z.infer<typeof chatGroupSchema>;
export type ChatGroupParticipant = z.infer<typeof chatGroupParticipant>;