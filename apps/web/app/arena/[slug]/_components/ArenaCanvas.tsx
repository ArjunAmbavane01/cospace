'use client';

import { useEffect, useRef } from 'react';
import { Engine } from 'excalibur';
import { User } from 'better-auth';
import { Socket } from 'socket.io-client';
import { ArenaUser } from '@/lib/validators/arena';
import { InitGame } from '@/components/game/main';

interface ArenaCanvasProps {
    slug: string;
    arenaUsers: ArenaUser[];
    socket: Socket | null;
    user: User;
}

export default function ArenaCanvas({ slug, arenaUsers, socket, user }: ArenaCanvasProps) {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const gameRef = useRef<Engine | null>(null);

    useEffect(() => {

        (async () => {
            try {
                if (!canvasRef.current || !socket || gameRef.current) return;
                gameRef.current = await InitGame(canvasRef.current, arenaUsers, socket, user);
                gameRef.current.start();
            } catch (error) {
                console.error("Failed to create arena:", error);
            }
        })();

        return () => {
            gameRef.current?.dispose();
            gameRef.current = null;
        };
    }, [slug, socket]);

    useEffect(() => {
        if (!gameRef.current) return;
        gameRef.current.emit("update-arena-users", arenaUsers);
    }, [arenaUsers])

    return <canvas ref={canvasRef} className='rounded-xl' />
}