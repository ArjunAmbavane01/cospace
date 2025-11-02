"use client"

import { useEffect, useMemo, useState } from "react";
import { UseMutateFunction, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getArenas, deleteArena, leaveArena } from "server/actions/arena";
import useAuthStore from "store/authStore";
import type { Session, User } from "better-auth";
import { Arena } from "@/lib/validators/arena";
import { AnimatePresence } from "motion/react";
import ArenaCardSkeleton from "./ArenaCardSkeleton";
import HubHeader from "./HubHeader";
import ArenaList from "./ArenaList";
import WelcomeUserToast from "@/components/toast/WelcomeUserToast";
import Navbar from "@/components/navbar/Navbar";
import { toast } from "sonner";

export type ArenaMutation = UseMutateFunction<
    { type: string; message: string; arenaSlug?: string },
    Error,
    string,
    unknown
>;

interface HubDashboardProps {
    userSession: { user: User; session: Session };
}

export default function HubDashboard({ userSession }: HubDashboardProps) {

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [showWelcomeToast, setShowWelcomeToast] = useState<boolean>(false);

    const { user, setUser, setToken } = useAuthStore();
    const queryClient = useQueryClient();
    const userId = userSession.user.id;

    // get user arenas
    const { data: userArenas, isLoading, isError, error } = useQuery({
        queryKey: ["arenas", userId],
        queryFn: async () => {
            const res = await getArenas();
            if (res.type === "error") throw new Error(res.message);
            return res.userArenas;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    // delete arena mutation
    const { mutate: deleteArenaMutation, isPending: isDeleting } = useMutation({
        mutationFn: async (arenaSlug: string) => {
            const res = await deleteArena(arenaSlug);
            if (res.type === "error") throw new Error(res.message);
            return res;
        },
        onMutate: async (arenaSlug) => {
            // cancel outgoing refecthes
            await queryClient.cancelQueries({ queryKey: ["arenas", userId] })
            // save previous value
            const previousArenas = queryClient.getQueryData<Arena[]>(["arenas", userId]);
            if (previousArenas) {
                queryClient.setQueryData(
                    ["arenas", userId],
                    previousArenas.filter(a => a.slug !== arenaSlug)
                );
            }
            return { previousArenas };
        },
        onSuccess: (res) => {
            toast.success(res.message);
        },
        onError: (err, _, context) => {
            // restore previous state
            if (context?.previousArenas) {
                queryClient.setQueryData(
                    ["arenas", userId],
                    [context.previousArenas]
                );
            }
            toast.error(err.message);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["arenas", userId] })
        },
    })

    // leave arena mutation
    const { mutate: leaveArenaMutation, isPending: isLeaving } = useMutation({
        mutationFn: async (arenaSlug: string) => {
            const res = await leaveArena(arenaSlug);
            if (res.type === "error") throw new Error(res.message);
            return res;
        },
        onMutate: async (arenaSlug) => {
            // cancel outgoing refecthes
            await queryClient.cancelQueries({ queryKey: ["arenas", userId] })
            // save previous value
            const previousArenas = queryClient.getQueryData<Arena[]>(["arenas", userId]);
            if (previousArenas) {
                queryClient.setQueryData(
                    ["arenas", userId],
                    previousArenas.filter(a => a.slug !== arenaSlug)
                );
            }
            return { previousArenas };
        },
        onSuccess: (res) => {
            toast.success(res.message);
        },
        onError: (err, _, context) => {
            // restore previous state
            if (context?.previousArenas) {
                queryClient.setQueryData(
                    ["arenas", userId],
                    [context.previousArenas]
                );
            }
            toast.error(err.message);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["arenas", userId] })
        }
    })

    const filteredArenas = useMemo(() => {
        if (!userArenas) return [];
        return userArenas.filter((arena) => {
            if (!arena?.name) return false;
            return arena.name.toLowerCase().includes(searchQuery.toLowerCase());
        })
    }, [searchQuery, userArenas])

    // welcome toast effect
    useEffect(() => {
        const welcomeFlag = "hasShownHubWelcome";
        if (!sessionStorage.getItem(welcomeFlag)) {
            //popup welcome
            setShowWelcomeToast(true);
            sessionStorage.setItem(welcomeFlag, "true");
        }
    }, []);

    // set user effect
    useEffect(() => {
        if (!user) {
            setUser(userSession.user);
            setToken(userSession.session.token);
        }
    }, [user, userSession])

    // fetching error effect
    useEffect(() => {
        if (isError && error) toast.error(error.message)
    }, [isError, error]);

    return (
        <div className='py-24 bg-background w-full min-h-screen relative'>
            <Navbar />
            <div className="flex flex-col gap-5 w-full max-w-7xl mx-auto space-y-10">
                <HubHeader setSearchQuery={setSearchQuery} />
                {
                    isLoading ? (
                        <div className="grid grid-cols-4 gap-24">
                            {Array.from({ length: 4 }).map((_, idx) => {
                                return <ArenaCardSkeleton key={`arenaCard-${idx}`} />
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
                    showWelcomeToast && user &&
                    <WelcomeUserToast
                        userName={user.name}
                        onClose={() => setShowWelcomeToast(false)}
                    />
                }
            </AnimatePresence>
        </div>
    )
}
