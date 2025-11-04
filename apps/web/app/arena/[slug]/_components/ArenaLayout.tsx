'use client';

import { useCallback, useEffect, useState } from 'react';
import { io, Socket } from "socket.io-client";
import { Session, User } from 'better-auth';
import useAuthStore from 'store/authStore';
import { OnlineUsersPayload, ServerToClientEvents, UserJoinedPayload } from "@repo/schemas/ws-arena-events";
import { ClientToServerEvents } from '@repo/schemas/arena-ws-events';
import { ArenaUser } from '@/lib/validators/arena';
import { ChatGroup } from '@/lib/validators/chat';
import ArenaSidebarContainer from './ArenaSidebarContainer';
import CanvasOverlay from './CanvasOverlay';
import ArenaCanvas from './ArenaCanvas';
import ChatPanel from './overlay/ChatPanel';
import { Button } from '@/components/ui/button';
import { MdErrorOutline } from "react-icons/md";
import ArenaLoading from './ArenaLoading';

export type Tabs = "map" | "chat" | "setting";

interface ArenaLayoutProps {
    slug: string,
    arenaUsers: ArenaUser[],
    userSession: { user: User; session: Session }
}

export default function ArenaLayout({ slug, arenaUsers: participants, userSession }: ArenaLayoutProps) {

    const [activeTab, setActiveTab] = useState<Tabs>("map");
    const [arenaUsers, setArenaUsers] = useState<ArenaUser[]>(participants);
    const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);
    const [activeGroup, setActiveGroup] = useState<ChatGroup | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState<boolean>(false);

    const { user, setUser, token, setToken } = useAuthStore();

    // init auth store
    useEffect(() => {
        if (userSession?.user && userSession?.session) {
            setUser(userSession.user);
            setToken(userSession.session.token);
        }
    }, [userSession, setUser, setToken]);

    useEffect(() => {

        setIsConnecting(true);
        if (!slug || !userSession?.session.token) {
            setConnectionError("Missing required authentication");
            setIsConnecting(false);
            return;
        }

        if (socket) return; // already connected

        // this is for the race condition
        let isCancelled = false;
        let ws: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
        (async () => {
            try {
                if (isCancelled) return;
                ws = io(`${process.env.NEXT_PUBLIC_WS_BACKEND_URL}`, {
                    auth: {
                        userToken: userSession.session.token,
                        arenaSlug: slug,
                    },
                    reconnection: true,
                    reconnectionDelay: 1000,
                    reconnectionAttempts: 3,
                });

                // connection handlers
                ws.on("connect", () => {
                    setConnectionError(null);
                    setIsConnecting(false);
                });

                ws.on("connect_error", (err) => {
                    console.log("Connection failed : ", err.message)
                    setConnectionError(`Connection failed: ${err.message}`);
                    setIsConnecting(false);
                });

                ws.on("disconnect", (reason) => {
                    if (reason === "io server disconnect") {
                        // server forcefully disconnected, try to reconnect
                        ws?.connect();
                    }
                });

                // arena event handlers
                ws.on("user-joined", (user: UserJoinedPayload) => {
                    const { userId, userName, userImage } = user;

                    if (userId === userSession.user.id) return;

                    setArenaUsers(prev => {
                        // check if user is already part of arena
                        const userExists = prev.find(u => u.id === userId);
                        if (userExists) {
                            return prev.map(u => u.id === userId ? { ...u, isOnline: true } : u);
                        }
                        return [...prev, {
                            id: userId,
                            name: userName,
                            image: userImage,
                            isOnline: true
                        }]
                    })
                });

                ws.on("online-users", (data: OnlineUsersPayload) => {
                    const { onlineUserIds } = data;
                    setArenaUsers(prev => prev.map(u => ({ ...u, isOnline: onlineUserIds.includes(u.id) })));
                });

                setSocket(ws);
            } catch (err) {
                setSocket(null);
                setIsConnecting(false);
                console.error(err instanceof Error ? err.message : err)
            }
        })();

        return () => {
            isCancelled = true;
            if (ws?.connected) ws.disconnect();
            setIsConnecting(false);
            setSocket(null);
        }
    }, [slug, userSession?.session?.token])

    const handleCloseChat = useCallback(() => {
        setActiveGroup(null);
        setActiveChatUserId(null);
    }, []);

    // force reconnect
    const handleRetryConnection = useCallback(() => {
        setConnectionError(null);
        setIsConnecting(true);
        setSocket(null);
    }, []);

    if (isConnecting) return <ArenaLoading />

    if (connectionError) {
        return (
            <div className='flex flex-col justify-center items-center gap-4 absolute inset-0 bg-background p-4'>
                <div className="flex flex-col items-center gap-3 text-center">
                    <MdErrorOutline className='size-8 text-destructive' />
                    <h3 className="font-semibold text-destructive">Connection Error</h3>
                    <h4>{connectionError}</h4>
                    <Button
                        onClick={handleRetryConnection}
                        variant="outline"
                        className="w-full"
                    >
                        Retry Connection
                    </Button>
                </div>
            </div>
        );
    }

    if (!user || !token) {
        return (
            <div className='flex flex-col justify-center items-center gap-4 absolute inset-0 bg-background/95'>
                <div className="flex flex-col gap-3">
                    <h3 className="font-semibold">Authentication Required</h3>
                    <p>Please sign in to access the arena.</p>
                </div>
            </div>
        );
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
                    <ChatPanel
                        slug={slug}
                        activeGroup={activeGroup}
                        activeTab={activeTab}
                        user={userSession.user}
                        handleCloseChat={handleCloseChat}
                    />
                    <ArenaCanvas slug={slug} arenaUsers={arenaUsers} socket={socket} user={user} />
                    <CanvasOverlay adminUser={user} />
                </div>
            </div>
        </>
    );
}