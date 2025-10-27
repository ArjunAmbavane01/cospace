import slugify from "slugify";
import { db } from "../../client";
import { arenas, usersToArenas } from "../../schemas";

const getSuffix = () => Math.random().toString(36).slice(2, 12);

export const createArena = async (inputArenaName: string, userId: string, userName: string) => {
    try {

        if (!inputArenaName.trim()) throw new Error("Arena name cannot be empty");

        const arenaName = inputArenaName.trim();
        let arenaSlug = slugify(inputArenaName, { lower: true, trim: true, strict: true })

        const result = await db.transaction(async (tx) => {
            let createdArena: typeof arenas.$inferSelect | undefined = undefined;
            let attempts = 0;
            const MAX_ATTEMPTS = 10;

            while (!createdArena && attempts < MAX_ATTEMPTS) {
                attempts++;
                const [newArena] = await tx
                    .insert(arenas)
                    .values({ name: arenaName, slug: arenaSlug, adminId: userId })
                    .onConflictDoNothing({ target: arenas.slug })
                    .returning()

                if (newArena) {
                    createdArena = newArena;
                    break;
                };
                arenaSlug = `${arenaSlug}-${getSuffix()}`;
            }

            if (!createdArena) throw new Error("Failed to create arena")

            const utaRow = await tx
                .insert(usersToArenas)
                .values({
                    userId,
                    arenaId: createdArena.id
                })
                .returning();

            if (!utaRow) throw new Error("Failed to link user to arena")

            return { createdArena, utaRow };
        })
        const { createdArena, utaRow } = result;
        const message = "Arena created successfully";
        const newArena = {
            ...createdArena,
            usersToArenas: utaRow,
            admin: { name: userName }
        }
        return {
            type: "success" as const,
            message,
            arena: newArena
        }
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unexpected error occurred. Please try again"
        return {
            type: "error" as const,
            message
        }
    }
}