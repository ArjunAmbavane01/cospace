"use client"

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { formatDate } from "@/lib/formatDate";
import { Arena } from "@/lib/validators/arena";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger, AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Check, ChevronUp, Link, Share2, SquarePenIcon, Trash2Icon, Users2, XCircle } from "lucide-react";
import { IoEnterOutline } from "react-icons/io5";

interface ArenaCardProps {
    arena: Arena
}

export default function ArenaCard({ arena }: ArenaCardProps) {

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
    const formattedDate = formatDate(arena.createdAt);
    return (
        <div className="flex flex-col w-72 h-56 overflow-hidden relative group rounded-xl">
            <motion.div
                transition={{ type: "spring", stiffness: 200, damping: 16 }}
                animate={{ y: openInfo ? "-8px" : 0 }}
                onClick={() => router.push(`/arena/${arena.slug}`)}
                className="h-44 rounded-xl border border-blue-800 group/image relative overflow-hidden z-10 cursor-pointer"
            >
                {
                    !openInfo && (
                        <>
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
                        className="flex items-center justify-between h-14 p-3 w-full"
                    >
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <motion.button
                                    onClick={handleCopyLink}
                                    className="relative border border-muted-foreground rounded-full p-2 cursor-pointer hover:border-primary transition-colors"
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

                        <div className="flex items-center justify-center text-center w-[60%] p-2 py-1 border border-primary border-dashed rounded-full">
                            {arena.name}
                        </div>
                        <div
                            className="border border-muted-foreground rounded-full p-2 cursor-pointer hover:bg-accent"
                            onClick={() => setopenInfo(true)}
                        >
                            <ChevronUp className="size-4" />
                        </div>
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
                        <ButtonGroup className="w-full">
                            <Button variant='outline' className="flex-1">
                                <SquarePenIcon />
                                Edit
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" className="flex-1 hover:text-destructive/90">
                                        <Trash2Icon />
                                        Delete
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Arena</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action is irreversible. Deleting this arena will remove all associated users, data, and settings.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction asChild>
                                            <Button variant={"destructive"}>
                                                <Trash2Icon />
                                                Delete
                                            </Button>
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </ButtonGroup>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
