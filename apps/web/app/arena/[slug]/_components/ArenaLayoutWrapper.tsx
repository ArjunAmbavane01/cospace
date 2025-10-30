'use client';

import { ArenaUser } from '@/lib/validators/arena';
import dynamic from 'next/dynamic';

const ArenaLayout = dynamic(() => import('./ArenaLayout'), {
    ssr: false,
    loading: () => <div>Loading arena...</div>
});

export default function ArenaLayoutWrapper({ slug, arenaUsers }: { slug: string, arenaUsers: ArenaUser[] }) {
    return <ArenaLayout slug={slug} arenaUsers={arenaUsers} />
}