import { and, eq } from "drizzle-orm";
import { db } from "../../client";
import { arenas, usersToArenas } from "../../schemas";

export const leaveArena = async (arenaSlug: string, userId: string) => {
    try {
        const arenaRecord = await db
            .select({ arenaId: arenas.id })
            .from(arenas)
            .where(eq(arenas.slug, arenaSlug));

        if (!arenaRecord[0]) throw new Error("Arena does not exists");
        const { arenaId } = arenaRecord[0];

        await db
            .delete(usersToArenas)
            .where(and(eq(usersToArenas.arenaId, arenaId), eq(usersToArenas.userId, userId)))

        const message = "Successfully left the arena";
        return {
            type: "success",
            message,
            arenaSlug
        }
    } catch (err) {
        console.error(err);
        const message = err instanceof Error ? err.message : "Failed to leave arena. Please try again"
        return {
            type: "error",
            message
        }
    }
}