import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import HubDashboard from './_components/HubDashboard'

export default async function page() {
    const userSession = await auth.api.getSession({
        headers: await headers()
    })
    if (!userSession) redirect("/signin")
    return <HubDashboard sessionUser={userSession.user} />
}
