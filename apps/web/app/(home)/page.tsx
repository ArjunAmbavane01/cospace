import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function page() {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (session) redirect("/hub")
    else redirect("/signin");
}
