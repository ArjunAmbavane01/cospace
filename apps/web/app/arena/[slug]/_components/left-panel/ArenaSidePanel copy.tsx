import { Dispatch, SetStateAction } from "react";
import { Tabs } from "../ArenaClient";
import { User } from "better-auth";
import { ArenaUser } from "@/lib/validators/game";
import UsersList from "./UsersList";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";

interface ArenaSidebarProps {
    user: User
    arenaUsers: ArenaUser[]
    activeTab: Tabs;
    setActiveTab: Dispatch<SetStateAction<Tabs>>;
    setActiveChatUser: Dispatch<SetStateAction<ArenaUser | null>>;
}

export default function ArenaSidePanel({ user, arenaUsers, activeTab, setActiveTab, setActiveChatUser }: ArenaSidebarProps) {
    const onlineUsers = arenaUsers.filter((user) => user.lastOnline === "online");
    const offlineUsers = arenaUsers.filter((user) => user.lastOnline !== "online");
    return (
        <div className="flex flex-col gap-8 w-72 p-3 bg-accent rounded-xl">
            <div className="px-1">
                <h3>
                    {user.name.split(" ")[0]}
                </h3>
            </div>
            <InputGroup className="border">
                <InputGroupInput
                    placeholder="Search people"
                />
                <InputGroupAddon align={"inline-end"}>
                    <Kbd>Ctrl</Kbd><Kbd>F</Kbd>
                </InputGroupAddon>
            </InputGroup>
            <div className="flex flex-col gap-3">
                {
                    arenaUsers.length === 0 ? (
                        <div>
                            No Users Found
                        </div>
                    ) : (
                        <>
                            <UsersList type="online" arenaUsers={onlineUsers} setActiveTab={setActiveTab} setActiveChatUser={setActiveChatUser} />
                            <UsersList type="offline" arenaUsers={offlineUsers} setActiveTab={setActiveTab} setActiveChatUser={setActiveChatUser} />
                        </>
                    )
                }
            </div>
        </div>
    )
}
