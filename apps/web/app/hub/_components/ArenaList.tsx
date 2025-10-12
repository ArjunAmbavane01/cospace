import { Separator } from "@/components/ui/separator";
import ArenaCard from "./ArenaCard";

export default function ArenaList() {
    const arenas = [1, 1, 1, 1];
    return (
        <div className="flex flex-col gap-5 w-full max-w-7xl mx-auto">
            <div className="flex gap-20 items-center">
                <h3>Arena List</h3>
            </div>
            <div className="grid grid-cols-4 gap-10">
                {arenas.map((arena, idx) => {
                    return <ArenaCard key={idx} />
                })}
            </div>
        </div>
    )
}
