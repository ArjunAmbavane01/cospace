import { z } from "zod";

export const arenaSchema = z.object({
    name: z.string().min(1, "Arena name must have at least 1 character").max(100, "Arena name cannot be longer than 100 characters"),
    slug: z.string().min(1, "Arena slug must have at least 1 character").max(120, "Arena slug cannot be longer than 120 characters"),
    adminId: z.string(),
    createdAt: z.date(),
    admin: z.object({
        name: z.string()
    }),
    usersToArenas: z.object({
        userId: z.string(),
    }).array(),
})

export type Arena = z.infer<typeof arenaSchema>;