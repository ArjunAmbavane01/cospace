"use client"

import { useEffect, useMemo, useState } from "react";
import { UseMutateFunction, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getArenas, deleteArena, joinArena, leaveArena } from "server/actions/arena";
import useAuthStore from "store/authStore";
import { Arena } from "@/lib/validators/arena";
import type { User } from "better-auth";
import { AnimatePresence } from "motion/react";
import HubHeader from "./HubHeader";
import ArenaList from "./ArenaList";
import ArenaCardSkeleton from "./ArenaCardSkeleton";
import Navbar from "@/components/navbar/Navbar";
import WelcomeUserToast from "@/components/toast/WelcomeUserToast";
import { toast } from "sonner";

export type ArenaMutation = UseMutateFunction<
    { type: string; message: string; arenaSlug?: string },
    Error,
    string,
    unknown
>;

interface HubDashboardProps {
    sessionUser: User;
}

export default function HubDashboard({ sessionUser }: HubDashboardProps) {

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [showWelcomeToast, setShowWelcomeToast] = useState<boolean>(false);

    const { user, setUser } = useAuthStore();
    const queryClient = useQueryClient();

    const userId = sessionUser.id;
    const { data: userArenas, isLoading, isError } = useQuery({
        queryKey: ["arenas", userId],
        queryFn: async () => {
            const res = await getArenas();
            if (res.type === "success") return res.userArenas
            else if (res.type === "error") toast.error(res.message)
        },
        staleTime: 60 * 1000 // 60 seconds
    })

    // delete arena mutation
    const { mutate: deleteArenaMutation, isPending: isDeleting } = useMutation({
        mutationFn: (arenaSlug: string) => deleteArena(arenaSlug),
        onSuccess: (res) => {
            if (res.type === "success") {
                const existingArenas = queryClient.getQueryData<Arena[]>(["arenas", userId]) || [];
                const remainingArenas = existingArenas.filter(arena => arena.slug !== res.arenaSlug);
                queryClient.setQueryData(["arenas", userId], [...remainingArenas]);
                toast.success(res.message);
            } else if (res.type === "error") {
                toast.error(res.message)
            };
        },
        onError: (err) => {
            toast.error(err instanceof Error ? err.message : "An unexpected error occurred.");
        },
    })

    // join arena mutation
    const { mutate: joinArenaMutation, isPending: isJoining } = useMutation({
        mutationFn: (arenaSlug: string) => joinArena(arenaSlug),
        onSuccess: (res) => {
            if (res.type === "success") {
                toast.success(res.message);
            } else if (res.type === "error") {
                toast.error(res.message)
            };
        },
        onError: (err) => {
            toast.error(err instanceof Error ? err.message : "An unexpected error occurred.");
        },
    })

    // leave arena mutation
    const { mutate: leaveArenaMutation, isPending: isLeaving } = useMutation({
        mutationFn: (arenaSlug: string) => leaveArena(arenaSlug),
        onSuccess: (res) => {
            if (res.type === "success") {
                const existingArenas = queryClient.getQueryData<Arena[]>(["arenas", userId]) || [];
                const remainingArenas = existingArenas.filter(arena => arena.slug !== res.arenaSlug);
                queryClient.setQueryData(["arenas", userId], [...remainingArenas]);
                toast.success(res.message);
            } else if (res.type === "error") {
                toast.error(res.message)
            };
        },
        onError: (err) => {
            toast.error(err instanceof Error ? err.message : "An unexpected error occurred.");
        },
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

    useEffect(() => {
        if (!user) setUser(sessionUser)
    }, [user, sessionUser])

    return (
        <div className='py-24 bg-background w-full min-h-screen relative'>
            <Navbar />
            <div className="flex flex-col gap-5 w-full max-w-7xl mx-auto space-y-10">
                <HubHeader
                    setSearchQuery={setSearchQuery}
                    joinArena={joinArenaMutation}
                    isJoining={isJoining}
                />
                {
                    isLoading ? (
                        <div className="grid grid-cols-4 gap-24">
                            {Array.from({ length: 4 }).map((_, idx) => {
                                return <ArenaCardSkeleton key={idx} />
                            })}
                        </div>
                    ) : <ArenaList
                        filteredArenas={filteredArenas}
                        searchQuery={searchQuery}
                        isError={isError}
                        isDeleting={isDeleting}
                        isLeaving={isLeaving}
                        deleteArena={deleteArenaMutation}
                        leaveArena={leaveArenaMutation}
                    />
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
