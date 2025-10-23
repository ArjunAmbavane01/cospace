"use server"
import { getArenas as getArenasQuery } from "@repo/db/queries/arena";

export const getArenas = async (userId: string) => {
    return await getArenasQuery(userId);
}