"use server"

import { getArenas as getArenasQuery, createArena as createArenaQuery, deleteArena as deleteArenaQuery, leaveArena as leaveArenaQuery, joinArena as joinArenaQuery, validateArenaSlug as validateArenaSlugQuery, editArena as editArenaQuery } from "@repo/db/queries/arena";
import { verifyAuth } from "./auth";
import { CreateArenaResponse, DeleteArenaResponse, EditArenaResponse, GetArenasResponse, JoinArenaResponse, LeaveArenaResponse, ValidateArenaSlugResponse } from "@/lib/validators/actions";

export const createArena = async (inputArenaName: string):Promise<CreateArenaResponse> => {
    const { id: userId, name: userName } = await verifyAuth();
    return await createArenaQuery(inputArenaName, userId, userName);
}

export const deleteArena = async (arenaSlug: string): Promise<DeleteArenaResponse> => {
    const { id: userId } = await verifyAuth();
    return await deleteArenaQuery(arenaSlug, userId);
}

export const getArenas = async (): Promise<GetArenasResponse> => {
    const { id: userId } = await verifyAuth();
    return await getArenasQuery(userId);
}

export const leaveArena = async (arenaSlug: string): Promise<LeaveArenaResponse> => {
    const { id: userId } = await verifyAuth();
    return await leaveArenaQuery(arenaSlug, userId);
}

export const joinArena = async (arenaSlug: string): Promise<JoinArenaResponse> => {
    const { id: userId } = await verifyAuth();
    return await joinArenaQuery(arenaSlug, userId);
}

export const editArena = async (inputArenaName: string, arenaSlug: string): Promise<EditArenaResponse> => {
    const { id: userId } = await verifyAuth();
    return await editArenaQuery(inputArenaName, arenaSlug, userId);
}

export const validateArenaSlug = async (arenaSlug: string): Promise<ValidateArenaSlugResponse> => {
    await verifyAuth();
    return await validateArenaSlugQuery(arenaSlug);
}