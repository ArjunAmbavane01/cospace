import { RefObject, useState } from "react";
import { ArenaUser } from "@/lib/validators/game";
import UserBtn from "./UserBtn";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";

interface UsersListProps {
    usersRef: RefObject<ArenaUser[]>;
    arenaUsers: ArenaUser[];
}

export default function UsersList({ usersRef, arenaUsers }: UsersListProps) {

    const [showOnlineUsers, setShowOnlineUsers] = useState<boolean>(true);
    const [showOfflineUsers, setShowOfflineUsers] = useState<boolean>(true);

    if (arenaUsers.length === 0) return <div>No Users Found</div>
    const onlineUsers = arenaUsers.filter((user) => user.lastOnline === "online");
    const offlineUsers = arenaUsers.filter((user) => user.lastOnline !== "online");
    return (
        <div className="flex flex-col gap-5">
            <Collapsible
                open={showOnlineUsers}
                onOpenChange={setShowOnlineUsers}
                className="flex flex-col gap-3"
            >
                <div className="flex items-center gap-3 w-full">
                    <p>
                        Online
                        ({onlineUsers.length})
                    </p>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-5">
                            {
                                showOnlineUsers ? <ChevronDown /> : <ChevronRight />
                            }
                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                    {onlineUsers.map(user => {
                        return <div>
                            <UserBtn user={user} />
                        </div>
                    })}
                </CollapsibleContent>
            </Collapsible>
            <Collapsible
                open={showOfflineUsers}
                onOpenChange={setShowOfflineUsers}
                className="flex flex-col gap-3"
            >
                <div className="flex items-center gap-3 w-full">
                    <p>
                        Offline ({offlineUsers.length})
                    </p>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-5">
                            {
                                showOnlineUsers ? <ChevronDown /> : <ChevronRight />
                            }
                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                    {offlineUsers.map(user => {
                        return <div>
                            <UserBtn user={user} />
                        </div>
                    })}
                </CollapsibleContent>
            </Collapsible>
        </div>
    )
}
