import { Dispatch, SetStateAction } from "react";
import { Tabs } from "../ArenaClient";
import { User } from "better-auth";
import { ArenaUser } from "@/lib/validators/game";
import ArenaSidebar from "./ArenaSidebar";
import ArenaSidePanel from "./ArenaSidePanel";
import ArenaChatGroupsPanel from "./ArenaChatGroupsPanel";

interface ArenaLeftPanelProps {
    user: User;
    slug: string;
    arenaUsers: ArenaUser[];
    activeTab: Tabs;
    setActiveTab: Dispatch<SetStateAction<Tabs>>;
    setActiveChatUser: Dispatch<SetStateAction<ArenaUser | null>>;
}

export default function ArenaLeftPanel({ user, slug, arenaUsers, activeTab, setActiveTab, setActiveChatUser }: ArenaLeftPanelProps) {

    return (
        <>
            <ArenaSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            {
                activeTab === "map" &&
                <ArenaSidePanel
                    user={user}
                    arenaUsers={arenaUsers}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    setActiveChatUser={setActiveChatUser}
                />
            }
            {
                activeTab === "chat" &&
                <ArenaChatGroupsPanel
                    slug={slug}
                    user={user}
                    setActiveChatUser={setActiveChatUser}
                />
            }
        </>
    )
}
