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
            <div className="text-muted-foreground text-center col-span-4 p-20 border border-dashed rounded-xl">
                No arenas found matching &quot;{searchQuery}&quot;
            </div>
        );
    }

    if (filteredArenas.length === 0) {
        return (
            <div className="text-muted-foreground text-center col-span-4 p-20 border border-dashed rounded-xl">
                <h4>
                    No arenas yet.{" "}
                    <span className="text-foreground">Create Arena</span> or{" "}
                    <span className="text-foreground">join one</span>{" "}
                    to get started!
                </h4>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-4 gap-x-24 gap-y-14">
            {filteredArenas?.map((arena) => {
                return <ArenaCard
                    key={arena.slug}
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
