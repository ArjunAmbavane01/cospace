import { z } from "zod";

export const authHeaderSchema = z.object({
    userToken: z.string(),
    arenaSlug: z.string().min(1, "Arena slug must have at least 1 character").max(120, "Arena slug cannot be longer than 120 characters"),
}) 