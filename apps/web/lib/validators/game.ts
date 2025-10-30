import { Character } from "@/components/game/actors/Character";

export type PlayerDirection = "up" | "down" | "left" | "right";

export interface ArenaUser {
    id: string;
    name: string;
    image: string | null | undefined;
    lastOnline: Date | "online";
    character?: Character;
}