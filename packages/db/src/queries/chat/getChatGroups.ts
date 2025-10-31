import { and, eq } from "drizzle-orm";
import { db } from "../../client";
import { arenas, messageGroups, usersToMessageGroups } from "../../schemas";

export const getChatGroups = async (userId: string, arenaSlug: string) => {
    try {
        if (!userId || !arenaSlug.trim()) throw new Error("Invalid arena or user information");

        // get arenaID
        const arenaRecord = await db
            .select({ arenaId: arenas.id })
            .from(arenas)
            .where(eq(arenas.slug, arenaSlug));

        if (!arenaRecord[0]) throw new Error("Arena does not exists");
        const { arenaId } = arenaRecord[0];

        const result = await db.query.messageGroups.findMany({
            where: (mg, { eq, inArray }) =>
                and(
                    eq(mg.arenaId, arenaId),
                    inArray(
                        mg.id,
                        db
                            .select({ id: usersToMessageGroups.messageGroupId })
                            .from(usersToMessageGroups)
                            .where(eq(usersToMessageGroups.userId, userId))
                    )
                ),
            with: {
                messages: {
                    columns: { content: true, createdAt: true },
                    limit: 1,
                    orderBy: (msgs, { desc }) => [desc(msgs.createdAt)],
                },
                usersToGroups: {
                    columns: {},
                    where: (utg, { ne }) => ne(utg.userId, userId),
                    with: {
                        user: {
                            columns: { id: true, name: true, image: true }
                        }
                    }
                }
            }
        });

        const chatGroups = result.map(g => ({
            createdAt: g.createdAt,
            updatedAt: g.updatedAt,
            publicId: g.publicId,
            lastMessage: g.messages[0] ?? null,
            participants: g.usersToGroups.map(u => { return { ...u.user, isOnline: false } }),
        }));

        return {
            type: "success" as const,
            message: "Successfully fetched user chat groups",
            chatGroups,
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