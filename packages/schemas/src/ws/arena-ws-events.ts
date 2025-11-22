import { z } from "zod";

export const MessageSchema = z.object({
    id: z.number(),
    senderId: z.string(),
    senderName: z.nullable(z.string()),
    senderImage: z.nullish(z.string()),
    content: z.string().max(512, "Message cannot exceed 512 characters"),
    createdAt: z.date(),
})

export const PlayerPosSchema = z.object({
    userId: z.string(),
    playerPos: z.object({
        x: z.number(),
        y: z.number(),
        direction: z.enum(["up", "down", "left", "right"]),
        isMoving: z.boolean(),
    })
});

export const ChatMessageSchema = z.object({
    groupPublicId: z.string(),
    message: MessageSchema
});

export const ChatGroupsSchema = z.object({
    chatGroupIds: z.string().array(),
});

export const MediaToggleSchema = z.object({
    userId: z.string(),
    participantId: z.string(),
    mediaType: z.enum(["video", "audio"]),
    enabled: z.boolean(),
});

export type PlayerPosPayload = z.infer<typeof PlayerPosSchema>;
export type ChatMessagePayload = z.infer<typeof ChatMessageSchema>;
export type ChatGroupsPayload = z.infer<typeof ChatGroupsSchema>;
export type MediaTogglePayload = z.infer<typeof MediaToggleSchema>;
export type Message = z.infer<typeof MessageSchema>;

export interface ClientToServerEvents {
    "player-pos": (data: PlayerPosPayload) => void
    "chat-message": (data: ChatMessagePayload) => void
    "chat-groups": (data: ChatGroupsPayload) => void
    "media-toggle": (data: MediaTogglePayload) => void
}