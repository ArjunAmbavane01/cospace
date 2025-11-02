import { desc, eq } from "drizzle-orm";
import { db } from "../../client";
import { messageGroups, messages, user } from "../../schemas";

export const getChatGroupMessages = async (userId: string, groupPublicId: string, MAX_PAGE_SIZE: number, offset: number) => {
    try {
        if (!userId || !groupPublicId.trim()) throw new Error("Invalid group or user information");

        // get group ID
        const groupRecord = await db
            .select({ groupId: messageGroups.id })
            .from(messageGroups)
            .where(eq(messageGroups.publicId, groupPublicId));

        if (!groupRecord[0]) throw new Error("Group does not exists");
        const { groupId } = groupRecord[0];

        // check if user is part of group or not
        const userInGroup = await db.query.usersToMessageGroups.findFirst({
            where: (utg, { eq, and }) => and(eq(utg.userId, userId), eq(utg.messageGroupId, groupId))
        })
        if (!userInGroup) throw new Error("You don't have access to this group");


        const groupMessages = await db
            .select({
                id: messages.id,
                content: messages.content,
                createdAt: messages.createdAt,
                senderId: messages.senderId,
                senderName: user.name,
                senderImage: user.image,
            })
            .from(messages)
            .leftJoin(user, eq(messages.senderId, user.id))
            .where(eq(messages.messageGroupId, groupId))
            .orderBy(desc(messages.createdAt))
            .limit(MAX_PAGE_SIZE)
            .offset(offset);

        return {
            type: "success" as const,
            message: "Successfully fetched user group messages",
            groupMessages: { rows: groupMessages },
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