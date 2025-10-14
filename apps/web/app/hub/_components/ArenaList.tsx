"use client"

import { useQuery } from "@tanstack/react-query";
import { getUserArenas } from "server/actions/arena/getUserArenas";
import ArenaCard from "./ArenaCard";
import ArenaCardSkeleton from "./ArenaCardSkeleton";

interface ArenaListProps {
    userId: string
}

export default function ArenaList({ userId }: ArenaListProps) {
    const { data: userArenas, isLoading, isError } = useQuery({
        queryKey: ["arenas", userId],
        queryFn: () => getUserArenas(userId),
        staleTime: 60*1000 // 60 seconds
    })

    if (isLoading) {
        return (
            <div className="grid grid-cols-4 gap-10">
                {Array.from({ length: 4 }).map((_, idx) => {
                    return <ArenaCardSkeleton key={idx} />
                })}
            </div>
        )
    }
    if (isError) {
        return (
            <div className="text-destructive text-center">
                Failed to load your arenas. Please try again later.
            </div>
        );
    }
    return (
        <div className="grid grid-cols-4 gap-10">
            {userArenas?.map((arena, idx) => {
                return <ArenaCard arena={arena} key={idx} />
            })}
        </div>
    )
}
