import { db } from "../../client";

export const getArenaUsers = async (arenaSlug: string, userId: string) => {
    try {
        if (!arenaSlug.trim()) throw new Error("Invalid arena slug")

        const arenaWithUsers = await db.query.arenas.findFirst({
            where: (a, { eq }) => eq(a.slug, arenaSlug),
            with: {
                usersToArenas: {
                    where: (uta, { ne }) => ne(uta.userId, userId),
                    columns: {},
                    with: {
                        user: {
                            columns: { id: true, name: true, image: true },
                        }
                    }
                }
            }
        })

        if (!arenaWithUsers) throw new Error("Arena does not exist")

        return {
            type: "success" as const,
            message: "Successfully fetched arena users",
            arenaUsers: arenaWithUsers.usersToArenas.map(au => { return { ...au.user, isOnline: false } }),
        }
    } catch (err) {
        console.error(err);
        const message = err instanceof Error ? err.message : "Unexpected error occurred. Please try again"
        return {
            type: "error" as const,
            message
        }
    }
}