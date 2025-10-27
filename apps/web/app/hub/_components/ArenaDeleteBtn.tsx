"use client"

import { useState } from "react";
import { ArenaMutation } from "./HubDashboard";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger, AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { Trash2Icon } from "lucide-react";

interface ArenaDeleteBtnProps {
    arenaSlug: string;
    deleteArena: ArenaMutation;
    isDeleting: boolean;
}

export default function ArenaDeleteBtn({ arenaSlug, deleteArena, isDeleting }: ArenaDeleteBtnProps) {

    const [open, setOpen] = useState<boolean>(false);

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem
                    onClick={(e) => {
                        e.preventDefault();
                        setOpen(true);
                    }}
                    className="hover:!text-destructive"
                >
                    <Trash2Icon />
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
                            onClick={() => deleteArena(arenaSlug)}
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
