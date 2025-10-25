"use server"

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation"

export const verifyAuth = async () => {
    const userSession = await auth.api.getSession({
        headers: await headers()
    });
    const userId = userSession?.user.id;
    if (!userId) redirect("/signin");
    return userId;
}