'use client';

import dynamic from 'next/dynamic';
import { ArenaUser } from '@/lib/validators/arena';
import { Session, User } from 'better-auth';

const ArenaLayout = dynamic(() => import('./ArenaLayout'), {
    ssr: false,
    loading: () => <div>Loading arena...</div>
});

interface ArenaLayoutWrapperProps {
    slug: string,
    arenaUsers: ArenaUser[],
    userSession: { user: User; session: Session }
}

export default function ArenaLayoutWrapper({ slug, arenaUsers, userSession }: ArenaLayoutWrapperProps) {
    return <ArenaLayout slug={slug} arenaUsers={arenaUsers} userSession={userSession} />
}