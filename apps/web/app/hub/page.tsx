import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Dashboard from './_components/Dashboard'

export default async function page() {
    const userSession = await auth.api.getSession({
        headers: await headers()
    })
    if (!userSession) redirect("/signin")
    return (
        <Dashboard user={userSession.user} />
    )
}
