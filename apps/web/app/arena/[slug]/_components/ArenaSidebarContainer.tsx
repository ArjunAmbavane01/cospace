import { Dispatch, SetStateAction } from "react";
import { User } from "better-auth";
import { ArenaUser } from "@/lib/validators/arena";
import { Tabs } from "./ArenaLayout";
import Sidebar from "./left-container/Sidebar";
import MapPanel from "./left-container/map/MapPanel";
import ChatGroupsPanel from "./left-container/chat/ChatGroupsPanel";

interface ArenaSidebarContainerProps {
    user: User;
    slug: string;
    arenaUsers: ArenaUser[];
    activeTab: Tabs;
    setActiveTab: Dispatch<SetStateAction<Tabs>>;
    setActiveChatUser: Dispatch<SetStateAction<ArenaUser | null>>;
    setActiveGroup: Dispatch<SetStateAction<string | null>>;
}

export default function ArenaSidebarContainer({ user, slug, arenaUsers, activeTab, setActiveTab, setActiveChatUser,setActiveGroup }: ArenaSidebarContainerProps) {

    const renderPanel = () => {
        switch (activeTab) {
            case "map":
                return (
                    <MapPanel
                        user={user}
                        arenaUsers={arenaUsers}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        setActiveChatUser={setActiveChatUser}
                    />
                );
            case "chat":
                return (
                    <ChatGroupsPanel
                        arenaUsers={arenaUsers}
                        slug={slug}
                        user={user}
                        setActiveChatUser={setActiveChatUser}
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
