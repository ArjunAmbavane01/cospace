import { z } from "zod";
import { PlayerPosPayload, ChatMessagePayload } from "./arena-ws-events";

export const WelcomeMsgSchema = z.string();
export type WelcomeMsgPayload = z.infer<typeof WelcomeMsgSchema>;

export const OnlineUsersSchema = z.object({
    onlineUserIds: z.string().array()
})
export type OnlineUsersPayload = z.infer<typeof OnlineUsersSchema>;

export const UserJoinedSchema = z.object({
    userId: z.string(),
    userName: z.string(),
    userImage: z.nullish(z.string()),
});
export type UserJoinedPayload = z.infer<typeof UserJoinedSchema>;

export const UserLeftSchema = z.object({
    userId: z.string(),
});

export type UserLeftPayload = z.infer<typeof UserLeftSchema>;

export interface ServerToClientEvents {
    "welcome": (message: string) => void
    "online-users": (data: OnlineUsersPayload) => void
    "user-joined": (data: UserJoinedPayload) => void
    "user-left": (data: UserLeftPayload) => void
    "player-pos": (data: PlayerPosPayload) => void
    "chat-message": (data: ChatMessagePayload) => void
}