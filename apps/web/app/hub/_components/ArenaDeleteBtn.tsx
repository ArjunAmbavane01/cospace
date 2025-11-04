"use client"

import { useState } from "react";
import useAuthStore from "store/authStore";
import { Arena } from "@/lib/validators/arena";
import { ArenaMutation } from "./HubDashboard";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger, AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";

interface ArenaDeleteBtnProps {
    arena: Arena;
    deleteArena: ArenaMutation;
    isDeleting: boolean;
}

export default function ArenaDeleteBtn({ arena, deleteArena, isDeleting }: ArenaDeleteBtnProps) {

    const [open, setOpen] = useState<boolean>(false);
    const { user } = useAuthStore();

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem
                    onClick={(e) => {
                        e.preventDefault();
                        setOpen(true);
                    }}
                    className="hover:!text-destructive group"
                >
                    <Trash2Icon className="group-hover:!text-destructive" />
                    Delete
                </DropdownMenuItem>
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
                        <Button
                            variant={"destructive"}
                            onClick={() => {
                                if (!user) return;
                                const isAdmin = user.id === arena.adminId;
                                if (!isAdmin) {
                                    toast.error("Only admin can delete this arena")
                                    return;
                                }
                                deleteArena(arena.slug)
                            }}
                        >
                            {
                                isDeleting ? (
                                    <>
                                        <Spinner />
                                        Deleting
                                    </>
                                ) : (
                                    <>
                                        <Trash2Icon />
                                        Delete
                                    </>
                                )
                            }
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
