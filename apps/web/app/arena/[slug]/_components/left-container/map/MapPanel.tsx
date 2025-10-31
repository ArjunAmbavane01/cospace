import { Dispatch, SetStateAction, useMemo, useRef, useState } from "react";
import { User } from "better-auth";
import { ArenaUser } from "@/lib/validators/arena";
import { Tabs } from "../../ArenaLayout";
import UsersList from "./UsersList";
import { Input } from "@/components/ui/input";

interface MapPanelProps {
    user: User
    arenaUsers: ArenaUser[]
    activeTab: Tabs;
    setActiveChatUserId: Dispatch<SetStateAction<string | null>>;
    setActiveTab: Dispatch<SetStateAction<Tabs>>;
}

export default function MapPanel({ user, arenaUsers, setActiveChatUserId, setActiveTab }: MapPanelProps) {

    const [searchQuery, setSearchQuery] = useState<string>("");

    const inputRef = useRef<HTMLInputElement | null>(null);

    const filteredArenas = useMemo(() => {
        if (!arenaUsers) return [];
        return arenaUsers.filter((user) => {
            if (!user?.name) return false;
            return user.name.toLowerCase().includes(searchQuery.toLowerCase());
        })
    }, [searchQuery, arenaUsers]);

    const onlineUsers = useMemo(() => filteredArenas.filter((user) => user.isOnline), [filteredArenas]);
    const offlineUsers = useMemo(() => filteredArenas.filter((user) => !user.isOnline), [filteredArenas]);
    return (
        <div className="flex flex-col gap-5 w-72 p-3 bg-accent rounded-xl">
            <div className="px-1">
                <h3>
                    {user.name.split(" ")[0]}
                </h3>
            </div>
            <Input
                ref={inputRef}
                onChange={(e) => (setSearchQuery(e.target.value.trim()))}
                placeholder="Search people"
            />
            <div className="flex flex-col gap-3">
                {
                    filteredArenas.length === 0 && searchQuery ? (
                        <div className="flex justify-center items-center h-40 p-5 text-muted-foreground text-center border border-dashed rounded-xl text-wrap break-all whitespace-normal">
                            No results for &quot;{searchQuery.slice(0, 20)}{searchQuery.length > 20 ? "…" : ""}&quot;.
                        </div>
                    ) : (
                        filteredArenas.length === 0 ? (
                            <div className="flex justify-center items-center h-40 p-5 text-muted-foreground text-center border border-dashed rounded-xl text-balance">
                                <h4>
                                    You're alone here. <span className="text-foreground">Invite</span> others to join.
                                </h4>
                            </div>
                        ) : (
                            <>
                                <UsersList type="online" arenaUsers={onlineUsers} setActiveChatUserId={setActiveChatUserId} setActiveTab={setActiveTab} />
                                <UsersList type="offline" arenaUsers={offlineUsers} setActiveChatUserId={setActiveChatUserId} setActiveTab={setActiveTab} />
                            </>
                        )
                    )}
            </div>
        </div>
    )
}
