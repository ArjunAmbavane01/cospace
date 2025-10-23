"use client"

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserArenas } from "server/actions/arena/getUserArenas";
import ArenaCard from "./ArenaCard";
import ArenaCardSkeleton from "./ArenaCardSkeleton";
import WelcomeUserToast from "@/components/toast/WelcomeUserToast";
import { AnimatePresence } from "motion/react";

interface ArenaListProps {
    userId: string
}

export default function ArenaList({ userId }: ArenaListProps) {

    const [showWelcomeToast, setShowWelcomeToast] = useState<boolean>(false);

    const { data: userArenas, isLoading, isError } = useQuery({
        queryKey: ["arenas", userId],
        queryFn: () => getUserArenas(userId),
        staleTime: 60 * 1000 // 60 seconds
    })

    useEffect(() => {
        const welcomeFlag = "hasShownHubWelcome";
        if (!sessionStorage.getItem(welcomeFlag)) {
            //popup welcome
            setShowWelcomeToast(true);
            sessionStorage.setItem(welcomeFlag, "true");
        }
    }, []);

    if (isLoading) {
        return (
            <div className="grid grid-cols-4 gap-24">
                {Array.from({ length: 4 }).map((_, idx) => {
                    return <ArenaCardSkeleton key={idx} />
                })}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-4 gap-x-24 gap-y-14">
            {isError ? (
                <div className="text-destructive text-center">
                    Failed to load your arenas. Please try again later.
                </div>
            ) : (
                <>
                    {userArenas?.map((arena, idx) => {
                        return <ArenaCard arena={arena} key={idx} />
                    })}
                </>
            )}
            <AnimatePresence>
                {showWelcomeToast && <WelcomeUserToast userName="Arjun" onClose={() => setShowWelcomeToast(false)} />}
            </AnimatePresence>
        </div>
    )
}
