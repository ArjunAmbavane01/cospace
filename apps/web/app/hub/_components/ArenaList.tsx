import { Arena } from "@/lib/validators/arena";
import ArenaCard from "./ArenaCard";
interface ArenaListProps {
    filteredArenas: Arena[];
    searchQuery: string;
    isError: boolean;
}

export default function ArenaList({ filteredArenas, searchQuery, isError }: ArenaListProps) {
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
                No arenas found matching "{searchQuery}"
            </div>
        );
    }

    if (filteredArenas.length === 0) {
        return (
            <div className="text-muted-foreground text-center col-span-4 p-20 border border-dashed rounded-xl">
                <h4>
                    You haven't created any arenas yet. Click "<span className="text-foreground">Create Arena</span>" to get started!
                </h4>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-4 gap-x-24 gap-y-14">
            {filteredArenas?.map((arena, idx) => {
                return <ArenaCard arena={arena} key={idx} />
            })}
        </div>
    )
}
