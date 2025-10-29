"use server"

import { getChatGroups as getChatGroupsQuery } from "@repo/db/queries/chat";
import { verifyAuth } from "./auth";

// export const getChatMessages = async (chatUserID: string) => {
//     const { id: userId } = await verifyAuth();
//     return await getChatMessagesQuery(userId, chatUserID);
// }

export const getChatGroups = async (arenaSlug: string) => {
    const { id: userId } = await verifyAuth();
    return await getChatGroupsQuery(userId, arenaSlug);
}