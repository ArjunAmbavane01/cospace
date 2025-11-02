"use server"

import { verifyAuth } from "./auth";
import { getChatGroups as getChatGroupsQuery, createChatGroup as createChatGroupQuery, getChatGroupMessages as getChatGroupMessagesQuery, createMessage as createMessageQuery } from "@repo/db/queries/chat";
import { CreateChatGroupResponse, GetChatMessagesResponse, GetChatGroupMessagesResponse, CreateMessageResponse } from "@/lib/validators/actions";

export const getChatGroups = async (arenaSlug: string): Promise<GetChatMessagesResponse> => {
    const { id: userId } = await verifyAuth();
    return getChatGroupsQuery(userId, arenaSlug);
}

export const createChatGroup = async (arenaSlug: string, participantId: string): Promise<CreateChatGroupResponse> => {
    const { id: userId } = await verifyAuth();
    return createChatGroupQuery(userId, participantId, arenaSlug);
}

export const getChatGroupMessages = async (groupPublicId: string, MAX_PAGE_SIZE: number, offset: number): Promise<GetChatGroupMessagesResponse> => {
    const { id: userId } = await verifyAuth();
    return getChatGroupMessagesQuery(userId, groupPublicId, MAX_PAGE_SIZE, offset)
}

export const createMessage = async (groupPublicId: string, content: string): Promise<CreateMessageResponse> => {
    const { id: userId, name: userName, image: userImage } = await verifyAuth();
    return createMessageQuery(userId, userName, userImage, groupPublicId, content)
}