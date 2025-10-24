"use server"

import { getArenas as getArenasQuery, createArena as createArenaQuery, deleteArena as deleteArenaQuery, leaveArena as leaveArenaQuery, joinArena as joinArenaQuery, validateArenaSlug as validateArenaSlugQuery } from "@repo/db/queries/arena";

export const createArena = async (inputArenaName: string, userId: string, userName: string) => {
    return await createArenaQuery(inputArenaName, userId, userName);
}

export const deleteArena = async (arenaSlug: string, userId: string) => {
    return await deleteArenaQuery(arenaSlug, userId);
}

export const getArenas = async (userId: string) => {
    return await getArenasQuery(userId);
}

export const leaveArena = async (arenaSlug: string, userId: string) => {
    return await leaveArenaQuery(arenaSlug, userId);
}

export const joinArena = async (arenaSlug: string, userId: string) => {
    return await joinArenaQuery(arenaSlug, userId);
}

export const validateArenaSlug = async (arenaSlug: string) => {
    return await validateArenaSlugQuery(arenaSlug);
}