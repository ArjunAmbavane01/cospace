'use client';

import dynamic from 'next/dynamic';

const ExcaliburGame = dynamic(() => import('./_components/Game'), {
    ssr: false,
    loading: () => <div>Loading game...</div>
});

export default function Page() {
    return (
        <ExcaliburGame />
    );
}