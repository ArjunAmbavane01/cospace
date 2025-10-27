"use server"

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation"

export const verifyAuth = async () => {
    const userSession = await auth.api.getSession({
        headers: await headers()
    });
    const user = userSession?.user;
    if (!user) redirect("/signin");
    return user;
}