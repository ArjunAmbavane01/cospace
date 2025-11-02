import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { getArenas } from 'server/actions/arena'
import { auth } from '@/lib/auth'
import HubDashboard from './_components/HubDashboard'

export default async function page() {
    const userSession = await auth.api.getSession({
        headers: await headers()
    })
    if (!userSession) redirect("/signin");

    // prefetch user arenas
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: ["arenas", userSession.user.id],
        queryFn: async () => {
            const res = await getArenas();
            if (res.type === "error") throw new Error(res.message);
            return res.userArenas;
        },
    })
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <HubDashboard userSession={userSession} />
        </HydrationBoundary>
    )
}
