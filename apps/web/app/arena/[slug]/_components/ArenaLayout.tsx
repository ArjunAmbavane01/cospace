'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from "socket.io-client";
import { User } from 'better-auth';
import { OnlineUsersPayload, ServerToClientEvents, UserJoinedPayload } from "@repo/schemas/ws-arena-events";
import { ClientToServerEvents } from '@repo/schemas/arena-ws-events';
import { authClient } from '@/lib/auth-client';
import { ArenaUser } from '@/lib/validators/arena';
import CanvasOverlay from './CanvasOverlay';
import ArenaCanvas from './ArenaCanvas';
import ArenaSidebarContainer from './ArenaSidebarContainer';
import ChatPanel from './overlay/ChatPanel';

export type Tabs = "map" | "chat" | "setting";

export default function ArenaLayout({ slug, arenaUsers: participants }: { slug: string, arenaUsers: ArenaUser[] }) {

    const [socket, setSocket] = useState<Socket | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [arenaUsers, setArenaUsers] = useState<ArenaUser[]>(participants);
    const [activeTab, setActiveTab] = useState<Tabs>("map");
    const [activeChatUser, setActiveChatUser] = useState<ArenaUser | null>(null);
    const [activeGroup, setActiveGroup] = useState<string | null>(null);

    useEffect(() => {

        if (socket || !slug) return;

        // this is for the race condition
        let isCancelled = false;
        let ws: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
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
                ws.on("user-joined", (user: UserJoinedPayload) => {
                    const newUser = { id: user.userId, name: user.userName, image: user.userImage, isOnline: true }
                    setArenaUsers(u => [...u, newUser])
                })
                ws.on("online-users", (data: OnlineUsersPayload) => {
                    const { onlineUserIds } = data
                    const updatedUsersList = arenaUsers.map(arena =>
                        ({ ...arena, isOnline: onlineUserIds.includes(arena.id) })
                    )
                    setArenaUsers([...updatedUsersList]);
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
                setArenaUsers([]);
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
                    {activeTab === "chat" && <ChatPanel activeChatUser={activeChatUser} activeGroup={activeGroup} />}
                    <ArenaCanvas slug={slug} arenaUsers={arenaUsers} socket={socket} user={user} />
                    <CanvasOverlay adminUser={user} />
                </div>
            </div>
        </>
    );
}