import { z } from "zod";

export const PlayerPosSchema = z.object({
    x: z.number(),
    y: z.number(),
    direction: z.enum(["up", "down", "left", "right"]),
    isMoving: z.boolean(),
});

export type PlayerPosPayload = z.infer<typeof PlayerPosSchema>;

export interface ClientToServerEvents {
    "player-pos": (data: PlayerPosPayload) => void
}