import { db } from "../../client";

export const getArenas = async (userId: string) => {
    try {
        const userArenas = await db.query.usersToArenas.findMany({
            columns: {
                arenaId: false,
            },
            where: (uta, { eq }) => eq(uta.userId, userId),
            with: {
                arena: {
                    columns: { id: false },
                    with: {
                        admin: { columns: { name: true } },
                        usersToArenas: { columns: { userId: true } }
                    }
                },
            },
        })
        return {
            type: "success",
            userArenas: userArenas.map(ua => ua.arena),
        }
    } catch (err) {
        console.error(err);
        const message = err instanceof Error ? err.message : "Unexpected error occurred. Please try again"
        return {
            type: "error",
            message
        }
    }
}