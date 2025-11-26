'use client';

import { useEffect, useState } from 'react';
import { Progress } from "@/components/ui/progress";
import Logo from '@/components/Logo';

const tips = [
    "Getting the space ready for you…",
    "Ensuring a smooth shared experience…",
    "Loading workspace assets…",
    "Bringing everyone into the room…",
    "Establishing real-time connections…",
    "Finalizing your virtual environment…",
];

export default function ArenaLoading() {
    const [progress, setProgress] = useState(10);
    const [tipIndex, setTipIndex] = useState(0);

    useEffect(() => {
        const p = setInterval(() => {
            setProgress(prev => (prev >= 100 ? 100 : prev + 5));
        }, 150);

        const t = setInterval(() => {
            setTipIndex(i => (i + 1) % tips.length);
        }, 1800);

        return () => {
            clearInterval(p);
            clearInterval(t);
        };
    }, []);

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
            <Logo />
            <h3>{tips[tipIndex]}</h3>
            <Progress value={progress} className="w-56" />
        </div>
    );
}
