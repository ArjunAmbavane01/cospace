import { Skeleton } from "@/components/ui/skeleton";
import ArenaCardSkeleton from "./_components/ArenaCardSkeleton";

export default function Loading() {
    return (
        <div className="py-24 bg-background w-full min-h-screen relative">
            {/* Navbar */}
            <div className="flex items-center gap-3 fixed top-5 inset-x-0 w-full max-w-7xl mx-auto p-3 px-5 bg-sidebar/80 backdrop-blur-md border rounded-lg z-50">
                <Skeleton className="size-10" />
                <h3>CoSpace</h3>
            </div>

            <div className="flex flex-col gap-5 w-full max-w-7xl mx-auto space-y-10">
                {/* Header */}
                <div className='flex flex-col gap-8 py-5 pt-10'>
                    <div className='flex flex-col gap-2'>
                        <h1>
                            Your Arenas
                        </h1>
                        <h4>
                            Manage your arenas and connect with your team
                        </h4>
                    </div>
                    <div className="flex justify-between items-center w-full">
                        <Skeleton className="h-10 w-md" />
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-9 w-36" />
                            <Skeleton className="h-9 w-32" />
                        </div>
                    </div>
                </div>

                {/* Arena cards */}
                <div className="grid grid-cols-4 gap-24">
                    {Array.from({ length: 4 }).map((_, idx) => {
                        return <ArenaCardSkeleton key={`arenaCard-${idx}`} />
                    })}
                </div>
            </div>
        </div>
    );
}
