import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import AuthForm from "@/components/auth/AuthForm";

export default async function page() {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (session) redirect("/hub")
    return <AuthForm mode="signup" />
}
