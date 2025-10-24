'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from "socket.io-client";
import { authClient } from '@/lib/auth-client';
import { ArenaUser } from '@/lib/validators/game';
import CanvasOverlay from './CanvasOverlay';
import { User } from 'better-auth';
import ArenaCanvas from './ArenaCanvas';

export default function ArenaClient({ slug }: { slug: string }) {

    const [socket, setSocket] = useState<Socket | null>(null);
    const [user, setUser] = useState<User | null>(null);

    const usersRef = useRef<ArenaUser[]>([]);

    useEffect(() => {

        if (socket || !slug) return;

        // this is for the race condition
        let isCancelled = false;
        let ws: Socket | null = null;
        (async () => {
            try {
                const { data: userSession } = await authClient.getSession();
                if (!userSession?.session) throw new Error("Session not found")

                if (isCancelled) return;
                ws = io("http://localhost:3002", {
                    auth: {
                        userToken: userSession.session.token,
                        arenaSlug: slug,
                    },
                });

                setUser(userSession.user);
                setSocket(ws);

                ws.on("connect_error", (err) => console.log("Connection failed : ", err.message))
                ws.on("user-joined", (user) => {
                    const prevUsers = usersRef.current;
                    usersRef.current = [...prevUsers, { ...user, lastOnline: "online" }]
                })
                ws.on("room-users", (data) => {
                    const { roomUsers } = data;
                    usersRef.current = roomUsers;
                })
            } catch (err) {
                setSocket(null);
                console.error(err instanceof Error ? err.message : err)
            }
        })();

        return () => {
            isCancelled = true;
            if (ws) {
                ws.disconnect();
                setUser(null);
                setSocket(null);
                usersRef.current = [];
            }
        }
    }, [slug])

    if (!socket || !user) {
        return <div className='flex justify-center items-center absolute inset-0 bg-black/80'>
            Loading Arena...
        </div>
    }

    return (
        <>
            <ArenaCanvas slug={slug} usersRef={usersRef} socket={socket} user={user} />
            <CanvasOverlay adminUser={user}/>
        </>
    );
}