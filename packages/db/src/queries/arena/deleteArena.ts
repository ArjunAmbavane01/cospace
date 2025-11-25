import { and, eq } from "drizzle-orm";
import { db } from "../../client";
import { arenas } from "../../schemas";

export const deleteArena = async (arenaSlug: string, userId: string) => {
    try {
        if (!arenaSlug.trim() || !userId) throw new Error("Invalid arena or user information")

        // check if arena exists
        const arenaRecord = await db
            .select({ adminId: arenas.adminId, arenaId: arenas.id })
            .from(arenas)
            .where(eq(arenas.slug, arenaSlug));

        if (!arenaRecord[0]) throw new Error("Arena does not exists");
        const { arenaId, adminId } = arenaRecord[0];

        // if user is trying to delete arena, block them 
        if (adminId !== userId) throw new Error("Only admin can delete this arena");

        // admin is deleting the arena, delete arena
        const deletedArenas = await db.delete(arenas)
            .where(and(eq(arenas.id, arenaId), eq(arenas.adminId, userId)))
            .returning();
        if (!deletedArenas[0]) throw new Error("Failed to delete arena");

        const message = "Arena deleted successfully";
        return {
            type: "success" as const,
            message,
            arenaSlug
        }
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unexpected error occurred. Please try again"
        return {
            type: "error" as const,
            message
        }
    }
}