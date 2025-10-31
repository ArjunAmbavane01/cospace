import { Arena } from "@/lib/validators/arena";
import { ArenaMutation } from "./HubDashboard";
import ArenaCard from "./ArenaCard";
interface ArenaListProps {
    filteredArenas: Arena[];
    searchQuery: string;
    isError: boolean;
    isDeleting: boolean;
    isLeaving: boolean;
    deleteArena: ArenaMutation;
    leaveArena: ArenaMutation;
}

export default function ArenaList({
    filteredArenas,
    searchQuery,
    isError,
    isDeleting,
    isLeaving,
    deleteArena,
    leaveArena,
}: ArenaListProps) {
    
    if (isError) {
        return (
            <div className="text-destructive text-center p-20 border border-dashed rounded-xl">
                Failed to load your arenas. Please try again later.
            </div>
        )
    }
   
    if (filteredArenas.length === 0 && searchQuery) {
        return (
            <div className="text-muted-foreground text-center p-20 border border-dashed rounded-xl break-all whitespace-normal">
                No arenas match &quot;{searchQuery.slice(0, 20)}{searchQuery.length > 20 ? "…" : ""}&quot;.
            </div>
        );
    }

    if (filteredArenas.length === 0) {
        return (
            <div className="text-muted-foreground text-center p-20 border border-dashed rounded-xl">
                <h4>
                    You don't have any arenas yet.{" "}
                    <span className="text-foreground">Create Arena</span> or{" "}
                    <span className="text-foreground">join</span>{" "}
                    one to begin!
                </h4>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-4 gap-x-24 gap-y-14">
            {filteredArenas?.map((arena) => {
                return <ArenaCard
                    key={`arenaCard-${arena.slug}`}
                    arena={arena}
                    isDeleting={isDeleting}
                    isLeaving={isLeaving}
                    deleteArena={deleteArena}
                    leaveArena={leaveArena}
                />
            })}
        </div>
    )
}
