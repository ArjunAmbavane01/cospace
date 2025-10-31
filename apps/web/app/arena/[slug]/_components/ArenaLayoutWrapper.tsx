'use client';

import dynamic from 'next/dynamic';
import { ArenaUser } from '@/lib/validators/arena';

const ArenaLayout = dynamic(() => import('./ArenaLayout'), {
    ssr: false,
    loading: () => <div>Loading arena...</div>
});

export default function ArenaLayoutWrapper({ slug, arenaUsers }: { slug: string, arenaUsers: ArenaUser[] }) {
    return <ArenaLayout slug={slug} arenaUsers={arenaUsers} />
}