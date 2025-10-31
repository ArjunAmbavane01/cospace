import { boolean, z } from "zod";

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

export type ChatGroup = z.infer<typeof chatGroupSchema>;
export type ChatGroupParticipant = z.infer<typeof chatGroupParticipant>;