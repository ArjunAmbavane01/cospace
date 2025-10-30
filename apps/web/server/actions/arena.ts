"use server"

import {
    getArenas as getArenasQuery,
    createArena as createArenaQuery,
    deleteArena as deleteArenaQuery,
    leaveArena as leaveArenaQuery,
    joinArena as joinArenaQuery,
    editArena as editArenaQuery,
    getArenaUsers as getArenaUsersQuery,
    validateArenaSlug as validateArenaSlugQuery,
} from "@repo/db/queries/arena";
import { verifyAuth } from "./auth";
import { CreateArenaResponse, DeleteArenaResponse, EditArenaResponse, GetArenasResponse, GetArenaUsersResponse, JoinArenaResponse, LeaveArenaResponse, ValidateArenaSlugResponse } from "@/lib/validators/actions";

export const createArena = async (inputArenaName: string): Promise<CreateArenaResponse> => {
    const { id: userId, name: userName } = await verifyAuth();
    return createArenaQuery(inputArenaName, userId, userName);
}

export const deleteArena = async (arenaSlug: string): Promise<DeleteArenaResponse> => {
    const { id: userId } = await verifyAuth();
    return deleteArenaQuery(arenaSlug, userId);
}

export const getArenas = async (): Promise<GetArenasResponse> => {
    const { id: userId } = await verifyAuth();
    return getArenasQuery(userId);
}

export const leaveArena = async (arenaSlug: string): Promise<LeaveArenaResponse> => {
    const { id: userId } = await verifyAuth();
    return leaveArenaQuery(arenaSlug, userId);
}

export const joinArena = async (arenaSlug: string): Promise<JoinArenaResponse> => {
    const { id: userId } = await verifyAuth();
    return joinArenaQuery(arenaSlug, userId);
}

export const editArena = async (inputArenaName: string, arenaSlug: string): Promise<EditArenaResponse> => {
    const { id: userId } = await verifyAuth();
    return editArenaQuery(inputArenaName, arenaSlug, userId);
}

export const getArenaUsers = async (arenaSlug: string): Promise<GetArenaUsersResponse> => {
    await verifyAuth();
    return getArenaUsersQuery(arenaSlug);
}

export const validateArenaSlug = async (arenaSlug: string): Promise<ValidateArenaSlugResponse> => {
    await verifyAuth();
    return validateArenaSlugQuery(arenaSlug);
}
