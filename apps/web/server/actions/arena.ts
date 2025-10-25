"use server"

import { getArenas as getArenasQuery, createArena as createArenaQuery, deleteArena as deleteArenaQuery, leaveArena as leaveArenaQuery, joinArena as joinArenaQuery, validateArenaSlug as validateArenaSlugQuery } from "@repo/db/queries/arena";
import { verifyAuth } from "./auth";
import { DeleteArenaResponse, GetArenasResponse, JoinArenaResponse, LeaveArenaResponse, ValidateArenaSlugResponse } from "@/lib/validators/actions";

export const createArena = async (inputArenaName: string, userName: string) => {
    const userId = await verifyAuth();
    return await createArenaQuery(inputArenaName, userId, userName);
}

export const deleteArena = async (arenaSlug: string): Promise<DeleteArenaResponse> => {
    const userId = await verifyAuth();

    if (!arenaSlug || !userId) return {
        type: "error",
        message: "Enter valid"
    }

    return await deleteArenaQuery(arenaSlug, userId);
}

export const getArenas = async (): Promise<GetArenasResponse> => {
    const userId = await verifyAuth();
    return await getArenasQuery(userId);
}

export const leaveArena = async (arenaSlug: string): Promise<LeaveArenaResponse> => {
    const userId = await verifyAuth();
    return await leaveArenaQuery(arenaSlug, userId);
}

export const joinArena = async (arenaSlug: string): Promise<JoinArenaResponse> => {
    const userId = await verifyAuth();
    return await joinArenaQuery(arenaSlug, userId);
}

export const validateArenaSlug = async (arenaSlug: string): Promise<ValidateArenaSlugResponse> => {
    await verifyAuth();
    return await validateArenaSlugQuery(arenaSlug);
}