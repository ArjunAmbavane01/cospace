import { eq } from "drizzle-orm";
import { db } from "../../client";
import { messageGroups, messages } from "../../schemas";

export const createMessage = async (userId: string, userName: string, userImage: string | undefined | null, groupPublicId: string, content: string) => {
    try {
        if (!userId || !groupPublicId || !content.trim()) throw new Error("Invalid chat or user information");
        if (content.length > 512) throw new Error("Message cannot exceed 512 characters");

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

        const res = await db
            .insert(messages)
            .values({ content, messageGroupId: groupId, senderId: userId })
            .returning();
        const createdMessage = res[0];
        if (!createdMessage) throw new Error("Failed to create message")

        return {
            type: "success" as const,
            message: "Successfully created message",
            createdMessage: {
                ...createdMessage,
                senderName: userName,
                senderImage: userImage
            }
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