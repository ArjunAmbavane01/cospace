import { z } from "zod"

export const signUpFormSchema = z.object({
    name: z.string().min(1, "Name must have at least 1 character").max(50, "Name cannot be longer than 50 characters"),
    email: z.email("Enter a valid email"),
    password: z
        .string()
        .min(4,"Password must have at least 4 character")
        .refine((password) => /[A-Z]/.test(password), {
            message: "Add one uppercase",
        })
        .refine((password) => /[0-9]/.test(password), {
            message: "Add one number",
        })
})

export const signInFormSchema = z.object({
    email: z.email("Enter a valid email"),
    password: z.string()
})