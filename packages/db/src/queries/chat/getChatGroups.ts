import { eq } from "drizzle-orm";
import { db } from "../../client";
import { arenas } from "../../schemas";

export const getChatGroups = async (userId: string, arenaSlug: string) => {
    try {
        if (!userId || !arenaSlug.trim()) throw new Error("Invalid arena or user information")

        // get arenaID
        const arenaRecord = await db
            .select({ arenaId: arenas.id })
            .from(arenas)
            .where(eq(arenas.slug, arenaSlug));

        if (!arenaRecord[0]) throw new Error("Arena does not exists");
        const { arenaId } = arenaRecord[0];

        // fetch all message groups for given userId
        const userChatgroups = await db.query.usersToMessageGroups.findMany({
            where: (utg, { eq }) => eq(utg.userId, userId),
            with: {
                messageGroup: {
                    columns: { id: false },
                    with: {
                        messages: {
                            columns: { content: true },
                            orderBy: (msgs, { desc }) => [desc(msgs.createdAt)],
                            limit: 1,

                        },
                        usersToGroups: {
                            with: {
                                user: {
                                    columns: { id: true, name: true, image: true },
                                }
                            }
                        }
                    }
                },
            },
        })

        const message = "Successfully fetched user chat groups";

        const chatGroups = userChatgroups
            .filter(ug => ug.messageGroup.arenaId === arenaId)
            .map(ug => {
                const group = ug.messageGroup;
                const lastMessage = group.messages[0];
                const participants = group.usersToGroups.map(u => u.user).filter(u => u.id !== userId);
                return {
                    createdAt: group.createdAt,
                    updatedAt: group.updatedAt,
                    publicId: group.publicId,
                    lastMessage,
                    participants,
                }
            })

        return {
            type: "success" as const,
            message,
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