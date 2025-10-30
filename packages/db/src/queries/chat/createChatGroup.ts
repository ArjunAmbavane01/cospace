import { eq } from "drizzle-orm";
import { db } from "../../client";
import { arenas, messageGroups, usersToMessageGroups } from "../../schemas";

export const createChatGroup = async (userId: string, participantId: string, arenaSlug: string) => {
    try {

        if (!userId || !participantId || !arenaSlug.trim()) throw new Error("Invalid arena or user information");

        // get arenaID
        const arenaRecord = await db
            .select({ arenaId: arenas.id })
            .from(arenas)
            .where(eq(arenas.slug, arenaSlug));

        if (!arenaRecord[0]) throw new Error("Arena does not exists");
        const { arenaId } = arenaRecord[0];

        const result = await db.transaction(async (tx) => {
            const [newMessageGroup] = await tx
                .insert(messageGroups)
                .values({ arenaId })
                .returning()

            if (!newMessageGroup) throw new Error("Failed to create group")

            await tx.insert(usersToMessageGroups).values([
                { userId, messageGroupId: newMessageGroup.id },
                { userId: participantId, messageGroupId: newMessageGroup.id },
            ]);

            return { newMessageGroup };
        })
        const { newMessageGroup } = result;
        const { id, arenaId: aId, ...groupWithoutIds } = newMessageGroup;
        const message = "Message group created successfully";
        return {
            type: "success" as const,
            message,
            newMessageGroup: groupWithoutIds
        }
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unexpected error occurred. Please try again"
        return {
            type: "error" as const,
            message
        }
    }
}