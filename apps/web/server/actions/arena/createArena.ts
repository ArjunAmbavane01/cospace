"use server"

import { createArena as createArenaQuery } from "@repo/db/queries/arena"

export const createArena = async (inputArenaName: string, userId: string, userName: string) => {
    return await createArenaQuery(inputArenaName, userId, userName);
}