'use client';

import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io, Socket } from "socket.io-client";
import { Session, User } from 'better-auth';
import useAuthStore from 'store/authStore';
import { useWebRTC } from 'hooks/useWebRTC';
import { OnlineUsersPayload, ServerToClientEvents, UserJoinedPayload } from "@repo/schemas/ws-arena-events";
import { ClientToServerEvents } from '@repo/schemas/arena-ws-events';
import { ChatGroup, MessagesInfiniteData } from '@/lib/validators/chat';
import { ArenaUser } from '@/lib/validators/arena';
import ArenaSidebarContainer from './ArenaSidebarContainer';
import CanvasOverlay from './CanvasOverlay';
import ArenaLoading from './ArenaLoading';
import ArenaCanvas from './ArenaCanvas';
import MediaSetup from './MediaSetup';
import ChatPanel from './overlay/ChatPanel';
import { Button } from '@/components/ui/button';
import { MdErrorOutline } from "react-icons/md";

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
    const [isSocketConnecting, setIsSocketConnecting] = useState<boolean>(false);

    const {
        webrtcSocket,
        localStream,
        setLocalStream,
        remoteStream,
        setRemoteStream,
        isUserMediaReady,
        setIsUserMediaReady,
        offerData,
        setOfferData,
        peerConnection,
        setPeerConnection,
        setTypeOfCall,
        handleCreateOffer,
        handleCreatePeerConnection
    } = useWebRTC(userSession, slug);

    const { user, setUser, token, setToken } = useAuthStore();
    const queryClient = useQueryClient();

    const handleCloseChat = useCallback(() => {
        setActiveGroup(null);
        setActiveChatUserId(null);
    }, []);

    // force reconnect
    const handleRetryConnection = useCallback(() => {
        setConnectionError(null);
        setIsSocketConnecting(true);
        setSocket(null);
    }, []);

    // init auth store
    useEffect(() => {
        if (userSession?.user && userSession?.session) {
            setUser(userSession.user);
            setToken(userSession.session.token);
        }
    }, [userSession, setUser, setToken]);

    // init connection to ws server
    useEffect(() => {

        setIsSocketConnecting(true);
        if (!slug || !userSession?.session.token) {
            setConnectionError("Missing required authentication");
            setIsSocketConnecting(false);
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
                    setIsSocketConnecting(false);
                });

                ws.on("connect_error", (err) => {
                    console.log("Connection failed : ", err.message)
                    setConnectionError(`Connection failed: ${err.message}`);
                    setIsSocketConnecting(false);
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

                ws.on("chat-message", (data) => {
                    const { groupPublicId, message: recievedMsg } = data;
                    console.log(groupPublicId)
                    // update group message cache and last message
                    queryClient.setQueryData<MessagesInfiniteData>(
                        ["messages", groupPublicId],
                        (oldData) => {
                            if (!oldData) return oldData;
                            const newPages = [...oldData.pages];
                            // Check if there are any pages at all
                            if (newPages[0]) {
                                // Append the recieved message to end of first page
                                newPages[0] = {
                                    ...newPages[0],
                                    rows: [recievedMsg, ...newPages[0].rows],
                                };
                            } else {
                                // if first message ever
                                newPages.push({ rows: [recievedMsg] });
                            }
                            return {
                                pages: newPages,
                                pageParams: oldData.pageParams,
                            };
                        }
                    );

                    queryClient.setQueryData<ChatGroup[]>(
                        ["chat-groups", slug],
                        (oldData) => {
                            if (!oldData) return oldData;
                            let targetGroup: ChatGroup | undefined;
                            const otherGroups: ChatGroup[] = [];

                            for (const group of oldData) {
                                if (group.publicId === groupPublicId) {
                                    targetGroup = group;
                                } else {
                                    otherGroups.push(group);
                                }
                            }
                            if (!targetGroup) return oldData;
                            const updatedGroup = {
                                ...targetGroup,
                                lastMessage: {
                                    content: recievedMsg.content,
                                    createdAt: recievedMsg.createdAt,
                                }
                            };

                            // updated group at the top
                            return [updatedGroup, ...otherGroups];
                        }
                    )
                })

                setSocket(ws);
            } catch (err) {
                setSocket(null);
                setIsSocketConnecting(false);
                console.error(err instanceof Error ? err.message : err)
            }
        })();

        return () => {
            isCancelled = true;
            if (ws?.connected) ws.disconnect();
            setIsSocketConnecting(false);
            setSocket(null);
        }
    }, [slug, userSession?.session?.token]);

    if (isSocketConnecting) return <ArenaLoading />

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

    if (!isUserMediaReady) return (
        <MediaSetup
            localStream={localStream}
            setLocalStream={setLocalStream}
            setIsUserMediaReady={setIsUserMediaReady}
        />
    )

    return (
        <>
            <div className='flex gap-2 h-screen py-4'>
                <ArenaSidebarContainer
                    user={user}
                    slug={slug}
                    socket={socket}
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
                        user={userSession.user}
                        slug={slug}
                        socket={socket}
                        activeGroup={activeGroup}
                        activeTab={activeTab}
                        handleCloseChat={handleCloseChat}
                    />
                    <ArenaCanvas slug={slug} arenaUsers={arenaUsers} socket={socket} user={user} />
                    <CanvasOverlay
                        adminUser={user}
                        webrtcSocket={webrtcSocket}
                        localStream={localStream}
                        setLocalStream={setLocalStream}
                        remoteStream={remoteStream}
                        setRemoteStream={setRemoteStream}
                        peerConnection={peerConnection}
                        setPeerConnection={setPeerConnection}
                        offerData={offerData}
                        setOfferData={setOfferData}
                        handleCreatePeerConnection={handleCreatePeerConnection}
                        handleCreateOffer={handleCreateOffer}
                        setTypeOfCall={setTypeOfCall}
                    />
                </div>
            </div>
        </>
    );
}