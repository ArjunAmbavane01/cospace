"use server"

import { db } from "@repo/db/client";

export const getUserArenas = async (userId: string) => {
    try {
        const userArenas = await db.query.usersToArenas.findMany({
            where: (uta, { eq }) => eq(uta.userId, userId),
            with: {
                arena: {
                    with: {
                        admin: {
                            columns: {
                                name: true,
                            }
                        },
                        usersToArenas: true
                    }
                },
            }
        })
        return userArenas.map(ua=>ua.arena);
    } catch (err) {
        console.error(err);
        throw new Error("Failed to fetch arenas");
    }
}