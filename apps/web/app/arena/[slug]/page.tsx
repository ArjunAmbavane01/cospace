'use client';

import { use } from 'react';
import dynamic from 'next/dynamic';

const ArenaClient = dynamic(() => import('./_components/ArenaClient'), {
    ssr: false,
    loading: () => <div>Loading arena...</div>
});

export default function ArenaPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)

    return <ArenaClient slug={slug} />
}