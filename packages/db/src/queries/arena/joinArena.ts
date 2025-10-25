import { and, eq } from "drizzle-orm";
import { db } from "../../client";
import { arenas, usersToArenas } from "../../schemas";

export const joinArena = async (arenaSlug: string, userId: string) => {
    try {
        const arenaRecord = await db
            .select({ arenaId: arenas.id })
            .from(arenas)
            .where(eq(arenas.slug, arenaSlug));

        if (!arenaRecord[0]) throw new Error("Arena does not exists");
        const { arenaId } = arenaRecord[0];

        await db
            .insert(usersToArenas)
            .values({
                arenaId,
                userId
            })
            .onConflictDoNothing({ target: [usersToArenas.userId, usersToArenas.arenaId] })

        const message = "Arena joined successfully";
        return {
            type: "success" as const,
            message,
            arenaSlug
        }
    } catch (err) {
        console.error(err);
        const message = err instanceof Error ? err.message : "Failed to join arena. Please try again"
        return {
            type: "error" as const,
            message
        }
    }
}