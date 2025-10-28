import { Dispatch, SetStateAction, useState } from "react";
import { ArenaUser } from "@/lib/validators/game";
import UserBtn from "./UserBtn";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";

interface UsersListProps {
    arenaUsers: ArenaUser[];
    setOpenChat: Dispatch<SetStateAction<boolean>>;
    type: "online" | "offline";
}

export default function UsersList({ arenaUsers, type, setOpenChat }: UsersListProps) {
    const [showUsers, setShowUsers] = useState<boolean>(true);
    return (
        <Collapsible
            open={showUsers}
            onOpenChange={setShowUsers}
            className="flex flex-col gap-2"
        >
            <div className="flex items-center gap-3 w-full">
                <p>
                    {type[0]?.toLocaleUpperCase() + type.slice(1) + " "}
                    ({arenaUsers.length})
                </p>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-5">
                        {
                            showUsers ? <ChevronDown /> : <ChevronRight />
                        }
                        <span className="sr-only">Toggle</span>
                    </Button>
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
                {arenaUsers.map(user => {
                    return <UserBtn key={user.userId} user={user} setOpenChat={setOpenChat} />
                })}
            </CollapsibleContent>
        </Collapsible>
    )
}
