'use client';

import dynamic from 'next/dynamic';
import { Session, User } from 'better-auth';
import { ArenaUser } from '@/lib/validators/arena';
import { Spinner } from '@/components/ui/spinner';

const ArenaLayout = dynamic(() => import('./ArenaLayout'), {
    ssr: false,
    loading: () => 
        <div className='absolute inset-0 flex justify-center items-center'>
            <Spinner />
        </div>
});

interface ArenaLayoutWrapperProps {
    slug: string,
    arenaUsers: ArenaUser[],
    userSession: { user: User; session: Session }
}

export default function ArenaLayoutWrapper({ slug, arenaUsers, userSession }: ArenaLayoutWrapperProps) {
    return <ArenaLayout slug={slug} arenaUsers={arenaUsers} userSession={userSession} />
}