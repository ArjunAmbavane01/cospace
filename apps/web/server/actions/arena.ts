"use server"

import { getArenas as getArenasQuery, createArena as createArenaQuery, deleteArena as deleteArenaQuery } from "@repo/db/queries/arena";

export const createArena = async (inputArenaName: string, userId: string, userName: string) => {
    return await createArenaQuery(inputArenaName, userId, userName);
}

export const deleteArena = async (arenaSlug: string, userId: string) => {
    return await deleteArenaQuery(arenaSlug, userId);
}

export const getArenas = async (userId: string) => {
    return await getArenasQuery(userId);
}