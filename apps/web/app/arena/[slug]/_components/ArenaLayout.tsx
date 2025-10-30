'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from "socket.io-client";
import { User } from 'better-auth';
import { authClient } from '@/lib/auth-client';
import { ArenaUser } from '@/lib/validators/game';
import CanvasOverlay from './CanvasOverlay';
import ArenaCanvas from './ArenaCanvas';
import ArenaSidebarContainer from './ArenaSidebarContainer';
import ChatPanel from './overlay/ChatPanel';

export type Tabs = "map" | "chat" | "setting";

export default function ArenaLayout({ slug }: { slug: string }) {

    const [socket, setSocket] = useState<Socket | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [arenaUsers, setArenaUsers] = useState<ArenaUser[]>([]);
    const [activeTab, setActiveTab] = useState<Tabs>("map");
    const [activeChatUser, setActiveChatUser] = useState<ArenaUser | null>(null);
    const [activeGroup, setActiveGroup] = useState<string | null>(null);

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
                    setArenaUsers(u => [...u, { ...user, lastOnline: "online" }])
                    usersRef.current = [...prevUsers, { ...user, lastOnline: "online" }]
                })
                ws.on("room-users", (data) => {
                    const { roomUsers } = data;
                    usersRef.current = roomUsers;
                    setArenaUsers([...roomUsers]);
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
            <div className='flex gap-2 h-screen py-4'>
                <ArenaSidebarContainer
                    user={user}
                    slug={slug}
                    arenaUsers={arenaUsers}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    setActiveChatUser={setActiveChatUser}
                    setActiveGroup={setActiveGroup}
                />
                <div className='flex-1 relative mx-3'>
                    {activeTab === "chat" && <ChatPanel activeChatUser={activeChatUser} activeGroup={activeGroup}/>}
                    <ArenaCanvas slug={slug} usersRef={usersRef} socket={socket} user={user} />
                    <CanvasOverlay adminUser={user} />
                </div>
            </div>
        </>
    );
}