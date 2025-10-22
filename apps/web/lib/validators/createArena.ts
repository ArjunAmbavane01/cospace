import z from "zod";

export const createArenaFormSchema = z.object({
    arenaName: z.string().min(1, "Arena name must have at least 1 character").max(100, "Arena name cannot be longer than 100 characters")
})