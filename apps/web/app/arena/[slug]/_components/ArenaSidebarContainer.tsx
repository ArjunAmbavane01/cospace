import { Dispatch, SetStateAction } from "react";
import { User } from "better-auth";
import { Socket } from "socket.io-client";
import { ChatGroup } from "@/lib/validators/chat";
import { ArenaUser } from "@/lib/validators/arena";
import { Tabs } from "./ArenaLayout";
import Sidebar from "./left-container/Sidebar";
import MapPanel from "./left-container/map/MapPanel";
import ChatGroupsPanel from "./left-container/chat/ChatGroupsPanel";

interface ArenaSidebarContainerProps {
    user: User;
    slug: string;
    socket: Socket | null;
    arenaUsers: ArenaUser[];
    activeGroup: ChatGroup | null;
    activeTab: Tabs;
    activeChatUserId: string | null;
    setActiveChatUserId: Dispatch<SetStateAction<string | null>>;
    setActiveTab: Dispatch<SetStateAction<Tabs>>;
    setActiveGroup: Dispatch<SetStateAction<ChatGroup | null>>;
}

export default function ArenaSidebarContainer({
    user,
    slug,
    socket,
    arenaUsers,
    activeGroup,
    activeTab,
    activeChatUserId,
    setActiveChatUserId,
    setActiveTab,
    setActiveGroup
}: ArenaSidebarContainerProps) {

    const renderPanel = () => {
        switch (activeTab) {
            case "map":
                return (
                    <MapPanel
                        user={user}
                        arenaUsers={arenaUsers}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        setActiveChatUserId={setActiveChatUserId}
                    />
                );
            case "chat":
                return (
                    <ChatGroupsPanel
                        socket={socket}
                        arenaUsers={arenaUsers}
                        activeGroup={activeGroup}
                        slug={slug}
                        activeChatUserId={activeChatUserId}
                        setActiveChatUserId={setActiveChatUserId}
                        setActiveGroup={setActiveGroup}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            {renderPanel()}
        </>
    )
}
