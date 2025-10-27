import { db } from "../../client";
import { arenas } from "../../schemas";
import { eq } from "drizzle-orm";

export const editArena = async (inputArenaName: string, arenaSlug: string, userId: string) => {
    try {

        if (!inputArenaName.trim() || !userId || !arenaSlug.trim()) throw new Error("Invalid arena or user information")

        // check who is trying to edit arena
        const arenaRecord = await db
            .select({ adminId: arenas.adminId, arenaId: arenas.id })
            .from(arenas)
            .where(eq(arenas.slug, arenaSlug));

        if (!arenaRecord[0]) throw new Error("Arena does not exists");
        const { adminId } = arenaRecord[0];

        // if user is trying to edit arena, block them 
        if (adminId !== userId) throw new Error("Only admin can edit this arena");

        const newArenaName = inputArenaName.trim();

        const result = await db.update(arenas).set({
            name: newArenaName
        }).where(eq(arenas.slug, arenaSlug)).returning();

        if (!result[0]) throw new Error("Failed to update the arena");
        const { name } = result[0];
        const message = "Arena updated successfully";
        return {
            type: "success" as const,
            message,
            newArenaDetails: {
                name
            }
        }
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unexpected error occurred. Please try again"
        return {
            type: "error" as const,
            message
        }
    }
}