'use client';

import { useEffect, useRef } from 'react';
import { InitGame } from '@/components/game/main';
import { Engine } from 'excalibur';

export default function ExcaliburGame() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const gameRef = useRef<Engine | null>(null);

    useEffect(() => {
        if (!canvasRef.current || gameRef.current) return;
        const initGame = async () => {
            gameRef.current = await InitGame(canvasRef.current!)
            gameRef.current.start();
        }
        initGame();
        return () => {
            gameRef.current?.stop();
            gameRef.current = null;
        };
    }, []);

    return <canvas ref={canvasRef} />;
}