import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function page() {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if(!session) redirect("/signin")
    return (
        <div className='p-3 bg-red-400'>
            Hey there
        </div>
    )
}
