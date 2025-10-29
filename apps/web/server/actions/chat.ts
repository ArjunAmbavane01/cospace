"use server"

import { getChatGroups as getChatGroupsQuery } from "@repo/db/queries/chat";
import { verifyAuth } from "./auth";
import { GetChatMessagesResponse } from "@/lib/validators/actions";

export const getChatGroups = async (arenaSlug: string): Promise<GetChatMessagesResponse> => {
    const { id: userId } = await verifyAuth();
    return getChatGroupsQuery(userId, arenaSlug);
}