"use server"

import { db } from "@repo/db/client";
import { arenas, usersToArenas } from "@repo/db/schema";
import slugify from "slugify";

const getSuffix = () => Math.random().toString(36).slice(2, 12);

export const createArena = async (inputArenaName: string, userId: string) => {
    try {
        const arenaName = inputArenaName;
        let arenaSlug = slugify(inputArenaName, {
            lower: true,
            trim: true,
            strict: true,
        })
        let createdArena: typeof arenas.$inferInsert | undefined = undefined;
        while (!createdArena) {
            const [newArena] = await db.insert(arenas).values({
                name: arenaName,
                slug: arenaSlug,
                adminId: userId
            }).onConflictDoNothing({ target: arenas.slug }).returning()
            if (newArena) {
                createdArena = newArena;
                await db.insert(usersToArenas).values({
                    userId,
                    arenaId: newArena.id
                })
                break;
            };
            arenaSlug = `${arenaSlug}-${getSuffix()}`;
        }
        const message = "Arena created successfully";
        return {
            type: "success",
            message,
            arena: createdArena
        }
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unexpected error occurred. Please try again"
        return {
            type: "error",
            message
        }
    }
}