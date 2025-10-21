export type PlayerDirection = "up" | "down" | "left" | "right";

export interface ArenaUser {
    userId: string;
    userName: string;
    lastOnline: Date | "online";
}