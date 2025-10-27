import { RefObject } from "react";
import { ArenaUser } from "@/lib/validators/game";
import UsersList from "./UsersList";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { SearchIcon } from "lucide-react";

interface ArenaSidebarProps {
    usersRef: RefObject<ArenaUser[]>;
    arenaUsers:ArenaUser[]
}

export default function ArenaSidebar({ usersRef,arenaUsers }: ArenaSidebarProps) {
    return (
        <div className="flex flex-col gap-8 w-72 p-3 bg-accent rounded-xl">
            <div className="px-1">
                <h3>
                    Arjun
                </h3>
            </div>
            <InputGroup className="border">
                <InputGroupInput
                    placeholder="Search people"
                />
                <InputGroupAddon>
                    <SearchIcon />
                </InputGroupAddon>
                <InputGroupAddon align={"inline-end"}>
                    <Kbd>Ctrl</Kbd><Kbd>F</Kbd>
                </InputGroupAddon>
            </InputGroup>
            <UsersList usersRef={usersRef} arenaUsers={arenaUsers}/>
        </div>
    )
}
