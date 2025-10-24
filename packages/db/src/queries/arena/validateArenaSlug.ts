import { db } from "../../client";

export const validateArenaSlug = async (arenaSlug: string) => {
    try {
        const arena = await db.query.arenas.findFirst({
            where: (arena, { eq }) => (eq(arena.slug, arenaSlug))
        })
        if (!arena) throw new Error("Arena does not exists");
        const message = "Arena exists";
        return {
            type: "success",
            message,
        }
    } catch (err) {
        console.error(err);
        const message = err instanceof Error ? err.message : "Failed to fetch arena. Please try again"
        return {
            type: "error",
            message
        }
    }
}