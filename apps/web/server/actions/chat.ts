"use server"

import { getChatGroups as getChatGroupsQuery, createChatGroup as createChatGroupQuery } from "@repo/db/queries/chat";
import { verifyAuth } from "./auth";
import { GetChatMessagesResponse } from "@/lib/validators/actions";

export const getChatGroups = async (arenaSlug: string): Promise<GetChatMessagesResponse> => {
    const { id: userId } = await verifyAuth();
    return getChatGroupsQuery(userId, arenaSlug);
}

export const createChatGroup = async (arenaSlug: string, participantId: string) => {
    const { id: userId } = await verifyAuth();
    return createChatGroupQuery(userId, participantId, arenaSlug);
}