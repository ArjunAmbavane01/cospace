"use client"

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/formatDate";
import { Arena } from "@/lib/validators/arena";
import { AnimatePresence, motion } from "motion/react";
import { ArenaMutation } from "./HubDashboard";
import ArenaDeleteBtn from "./ArenaDeleteBtn";
import ArenaEditDialog from "./ArenaEditDialog";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IoEnterOutline, IoLogOutOutline } from "react-icons/io5";
import { CiMenuKebab } from "react-icons/ci";
import { Check, ChevronUp, Share2, Users2, XCircle } from "lucide-react";

interface ArenaCardProps {
    arena: Arena;
    isDeleting: boolean;
    isLeaving: boolean;
    deleteArena: ArenaMutation;
    leaveArena: ArenaMutation;
}

export default function ArenaCard({
    arena,
    isDeleting,
    isLeaving,
    deleteArena,
    leaveArena,
}: ArenaCardProps) {

    const [openInfo, setopenInfo] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);
    const router = useRouter();

    const handleCopyLink = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const arenaUrl = `${window.location.origin}/arena/${arena.slug}`;
        try {
            await navigator.clipboard.writeText(arenaUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const adminUser = arena.admin;
    const usersCount = arena.usersToArenas?.length;
    const formattedDate = formatDate(arena.createdAt,"card");
    return (
        <div className="flex flex-col w-72 h-56 overflow-hidden relative group rounded-xl">
            <motion.div
                transition={{ type: "spring", stiffness: 200, damping: 16 }}
                animate={{ y: openInfo ? "-8px" : 0 }}
                onClick={() => router.push(`/arena/${arena.slug}`)}
                className="h-44 rounded-xl border-2 border-blue-400 group/image relative overflow-hidden z-10 cursor-pointer"
            >
                {
                    !openInfo && (
                        <>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <motion.button
                                        onClick={handleCopyLink}
                                        className="absolute top-2 right-2 border border-accent rounded-full p-2 cursor-pointer hover:border-background bg-background hover:bg-accent transition-colors z-20"
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <AnimatePresence mode="wait">
                                            {copied ? (
                                                <motion.div
                                                    key="check"
                                                    initial={{ scale: 0, rotate: -180 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    exit={{ scale: 0, rotate: 180 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <Check className="size-4 stroke-2 text-emerald-600" />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="share"
                                                    initial={{ scale: 0, rotate: 180 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    exit={{ scale: 0, rotate: -180 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <Share2 className="size-4" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Share Link
                                </TooltipContent>
                            </Tooltip>
                            <div className="absolute top-2 left-2 flex items-center gap-2 p-1 px-2 bg-background pointer-events-none rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity z-20">
                                <Users2 size={12} />
                                <h6>{usersCount || 0}</h6>
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-2 px-3 py-2 bg-background/80 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity z-20">
                                <IoEnterOutline size={16} />
                                <h5>Enter</h5>
                            </div>
                        </>
                    )
                }
                <Image
                    src={"/assets/maps/island-base.png"}
                    alt="Arena placeholder"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-background/20 group-hover/image:bg-background/50 transition-opacity" />
            </motion.div>
            <AnimatePresence mode="wait">
                {!openInfo ? (
                    <motion.div
                        key="closed"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-between gap-3 h-14 p-3 w-full"
                    >
                        <div
                            className="border border-muted-foreground rounded-full p-2 cursor-pointer hover:bg-accent transition-colors"
                            onClick={() => setopenInfo(true)}
                        >
                            <ChevronUp className="size-4" />
                        </div>
                        <div className="flex items-center justify-center text-center w-full p-2 py-1 border border-primary border-dashed rounded-full inner-shadow bg-white/5">
                            {arena.name}
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div
                                    className="border border-muted-foreground rounded-full p-2 cursor-pointer hover:bg-accent transition-colors"
                                    onClick={() => setopenInfo(true)}
                                >
                                    <CiMenuKebab className="size-4" />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuGroup>
                                    <ArenaEditDialog arenaSlug={arena.slug} arena={arena} />
                                    <DropdownMenuItem onClick={() => leaveArena(arena.slug)}>
                                        {
                                            isLeaving ? (
                                                <>
                                                    <Spinner />
                                                    Leaving
                                                </>
                                            ) : (
                                                <>
                                                    <IoLogOutOutline />
                                                    Leave
                                                </>
                                            )
                                        }
                                    </DropdownMenuItem>
                                    <ArenaDeleteBtn
                                        arenaSlug={arena.slug}
                                        deleteArena={deleteArena}
                                        isDeleting={isDeleting}
                                    />
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </motion.div>
                ) : (
                    <motion.div
                        key="open"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15 }}
                        className="flex flex-col gap-3 border rounded-xl p-4 relative"
                    >
                        <XCircle
                            className="absolute top-2 right-2 size-5 text-muted-foreground cursor-pointer"
                            onClick={() => setopenInfo(false)}
                        />
                        <div className="w-full grid grid-cols-3 items-start">
                            <div className="flex flex-col gap-1 col-span-1 tracking-wide">
                                <h5>Name</h5>
                                <h5>Created</h5>
                                <h5>Admin</h5>
                            </div>
                            <div className="flex flex-col gap-1 col-span-2">
                                <p>{arena.name}</p>
                                <p>{formattedDate}</p>
                                <p>{adminUser.name}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
