import { Character } from "@/components/game/actors/Character";

export type PlayerDirection = "up" | "down" | "left" | "right";

export interface ArenaUser {
    userId: string;
    userName: string;
    userImage: string | null | undefined;
    lastOnline: Date | "online";
    character?: Character;
}