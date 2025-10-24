'use client';

import dynamic from 'next/dynamic';

const ArenaClient = dynamic(() => import('./ArenaClient'), {
    ssr: false,
    loading: () => <div>Loading arena...</div>
});

export default function ArenaClientWrapper({ slug }: { slug: string }) {
    return <ArenaClient slug={slug} />
}