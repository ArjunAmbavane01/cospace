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

        // fetch all message groups user is part of in this arena
        const userGroupsInArena = await db
            .select({ messageGroupId: usersToMessageGroups.messageGroupId })
            .from(usersToMessageGroups)
            .innerJoin(messageGroups,
                and(
                    eq(messageGroups.id, usersToMessageGroups.messageGroupId),
                    eq(messageGroups.arenaId, arenaId)
                )
            )
            .where(eq(usersToMessageGroups.userId, userId))

        if (userGroupsInArena.length === 0) {
            return {
                type: "success" as const,
                message: "No chat groups found",
                chatGroups: [],
            };
        }

        const groupIds = userGroupsInArena.map(uga => uga.messageGroupId);

        // fetch last message and participant for these groups
        const userChatgroups = await db.query.usersToMessageGroups.findMany({
            where: (utg, { and, eq, inArray }) =>
                and(
                    eq(utg.userId, userId),
                    inArray(utg.messageGroupId, groupIds)
                ),
            with: {
                messageGroup: {
                    columns: { id: false },
                    with: {
                        messages: {
                            columns: { content: true, createdAt: true },
                            orderBy: (msgs, { desc }) => [desc(msgs.createdAt)],
                            limit: 1,

                        },
                        usersToGroups: {
                            where: (utg, { ne }) => ne(utg.userId, userId),
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

        const chatGroups = userChatgroups
            .map(ug => {
                const group = ug.messageGroup;
                const lastMessage = group.messages[0] || null;
                const participants = group.usersToGroups.map(u => u.user);
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