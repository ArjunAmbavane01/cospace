"use client"

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getArenas } from "server/actions/arena/getArenas";
import type { User } from "better-auth";
import { AnimatePresence } from "motion/react";
import HubHeader from "./HubHeader";
import ArenaList from "./ArenaList";
import ArenaCardSkeleton from "./ArenaCardSkeleton";
import Navbar from "@/components/navbar/Navbar";
import WelcomeUserToast from "@/components/toast/WelcomeUserToast";
import { toast } from "sonner";

interface HubDashboardProps {
    user: User;
}

export default function HubDashboard({ user }: HubDashboardProps) {

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [showWelcomeToast, setShowWelcomeToast] = useState<boolean>(false);

    const { data: userArenas, isLoading, isError } = useQuery({
        queryKey: ["arenas", user.id],
        queryFn: async () => {
            const res = await getArenas(user.id);
            if (res.type === "success") return res.userArenas
            else if (res.type === "error") toast.error(res.message)
        },
        staleTime: 60 * 1000 // 60 seconds
    })

    const filteredArenas = useMemo(() => (userArenas?.filter((arena) => {
        if (!userArenas) return []
        return arena.name.toLowerCase().includes(searchQuery.toLowerCase());
    }) || []), [searchQuery, userArenas])

    useEffect(() => {
        const welcomeFlag = "hasShownHubWelcome";
        if (!sessionStorage.getItem(welcomeFlag)) {
            //popup welcome
            setShowWelcomeToast(true);
            sessionStorage.setItem(welcomeFlag, "true");
        }
    }, []);

    return (
        <div className='py-24 bg-background w-full min-h-screen relative'>
            <Navbar user={user} />
            <div className="flex flex-col gap-5 w-full max-w-7xl mx-auto space-y-10">
                <HubHeader user={user} setSearchQuery={setSearchQuery} />
                {
                    isLoading ? (
                        <div className="grid grid-cols-4 gap-24">
                            {Array.from({ length: 4 }).map((_, idx) => {
                                return <ArenaCardSkeleton key={idx} />
                            })}
                        </div>
                    ) : <ArenaList filteredArenas={filteredArenas} searchQuery={searchQuery} isError={isError} />
                }
            </div>
            <AnimatePresence>
                {
                    showWelcomeToast &&
                    <WelcomeUserToast
                        userName="Arjun"
                        onClose={() => setShowWelcomeToast(false)}
                    />
                }
            </AnimatePresence>
        </div>
    )
}
