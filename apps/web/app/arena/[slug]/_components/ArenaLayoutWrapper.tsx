'use client';

import dynamic from 'next/dynamic';

const ArenaLayout = dynamic(() => import('./ArenaLayout'), {
    ssr: false,
    loading: () => <div>Loading arena...</div>
});

export default function ArenaLayoutWrapper({ slug }: { slug: string }) {
    return <ArenaLayout slug={slug} />
}