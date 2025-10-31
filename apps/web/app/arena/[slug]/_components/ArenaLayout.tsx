'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from "socket.io-client";
import { User } from 'better-auth';
import { OnlineUsersPayload, ServerToClientEvents, UserJoinedPayload } from "@repo/schemas/ws-arena-events";
import { ClientToServerEvents } from '@repo/schemas/arena-ws-events';
import { authClient } from '@/lib/auth-client';
import { ArenaUser } from '@/lib/validators/arena';
import { ChatGroup } from '@/lib/validators/chat';
import ArenaSidebarContainer from './ArenaSidebarContainer';
import CanvasOverlay from './CanvasOverlay';
import ArenaCanvas from './ArenaCanvas';
import ChatPanel from './overlay/ChatPanel';

export type Tabs = "map" | "chat" | "setting";

export default function ArenaLayout({ slug, arenaUsers: participants }: { slug: string, arenaUsers: ArenaUser[] }) {

    const [activeTab, setActiveTab] = useState<Tabs>("map");
    const [arenaUsers, setArenaUsers] = useState<ArenaUser[]>(participants);
    const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);
    const [activeGroup, setActiveGroup] = useState<ChatGroup | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [user, setUser] = useState<User | null>(null);

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
                    setArenaUsers(u => {
                        // check if user already exists
                        if (u.some(a => a.id === newUser.id)) return u;
                        return [...u, newUser]
                    })
                })
                ws.on("online-users", (data: OnlineUsersPayload) => {
                    const { onlineUserIds } = data;
                    setArenaUsers(u =>
                        u.map(arena => ({
                            ...arena,
                            isOnline: onlineUserIds.includes(arena.id)
                        }))
                    );
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
                    activeGroup={activeGroup}
                    activeTab={activeTab}
                    activeChatUserId={activeChatUserId}
                    setActiveChatUserId={setActiveChatUserId}
                    setActiveTab={setActiveTab}
                    setActiveGroup={setActiveGroup}
                />
                <div className='flex-1 relative mx-3'>
                    {activeTab === "chat" && <ChatPanel activeGroup={activeGroup} />}
                    <ArenaCanvas slug={slug} arenaUsers={arenaUsers} socket={socket} user={user} />
                    <CanvasOverlay adminUser={user} />
                </div>
            </div>
        </>
    );
}