import { Dispatch, SetStateAction } from "react";
import { User } from "better-auth";
import { ArenaUser } from "@/lib/validators/arena";
import { Tabs } from "../../ArenaLayout";
import UsersList from "./UsersList";
import { Kbd } from "@/components/ui/kbd";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

interface MapPanelProps {
    user: User
    arenaUsers: ArenaUser[]
    activeTab: Tabs;
    setActiveChatUserId: Dispatch<SetStateAction<string | null>>;
    setActiveTab: Dispatch<SetStateAction<Tabs>>;
}

export default function MapPanel({ user, arenaUsers, setActiveChatUserId, setActiveTab }: MapPanelProps) {
    const onlineUsers = arenaUsers.filter((user) => user.isOnline);
    const offlineUsers = arenaUsers.filter((user) => !user.isOnline);
    return (
        <div className="flex flex-col gap-5 w-72 p-3 bg-accent rounded-xl">
            <div className="px-1">
                <h3>
                    {user.name.split(" ")[0]}
                </h3>
            </div>
            <InputGroup>
                <InputGroupInput placeholder="Search people" />
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
                            <UsersList type="online" arenaUsers={onlineUsers} setActiveChatUserId={setActiveChatUserId} setActiveTab={setActiveTab} />
                            <UsersList type="offline" arenaUsers={offlineUsers} setActiveChatUserId={setActiveChatUserId} setActiveTab={setActiveTab} />
                        </>
                    )
                }
            </div>
        </div>
    )
}
