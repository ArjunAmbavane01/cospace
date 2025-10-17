'use client';

import { useEffect, useRef } from 'react';
import { Engine } from 'excalibur';
import { InitGame } from '@/components/game/main';

export default function ExcaliburGame() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const gameRef = useRef<Engine | null>(null);

    useEffect(() => {
        if (!canvasRef.current || gameRef.current) return;

        const initGame = async () => {
            try {
                gameRef.current = await InitGame(canvasRef.current!);
                gameRef.current.start();
            } catch (error) {
                console.error("Failed to create arena:", error);
            }
        }
        initGame();

        return () => {
            gameRef.current?.stop();
            gameRef.current = null;
        };
    }, []);

    return <canvas ref={canvasRef} />;
}