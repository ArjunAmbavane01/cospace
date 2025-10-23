import { Skeleton } from "@/components/ui/skeleton";

export default function ArenaCardSkeleton() {
    return (
        <div className="flex flex-col w-72 h-56 overflow-hidden relative rounded-xl">
            <Skeleton className="h-44 rounded-xl" />
            
            <div className="flex items-center justify-between h-14 p-3 w-full">
                <Skeleton className="rounded-full size-8" />
                <Skeleton className="h-7 w-[60%] rounded-full" />
                <Skeleton className="rounded-full size-8" />
            </div>
        </div>
    );
}