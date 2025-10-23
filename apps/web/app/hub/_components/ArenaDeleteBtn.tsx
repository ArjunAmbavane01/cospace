"use client"

import { DeleteArenaMutation } from "./HubDashboard";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger, AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Trash2Icon } from "lucide-react";

interface ArenaDeleteBtnProps {
    arenaSlug: string;
    deleteArena: DeleteArenaMutation;
    isDeletePending: boolean;
}

export default function ArenaDeleteBtn({ arenaSlug, deleteArena, isDeletePending }: ArenaDeleteBtnProps) {
    return (
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
                        <Button
                            variant={"destructive"}
                            onClick={() => deleteArena(arenaSlug)}
                        >
                            <Trash2Icon />
                            Delete
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
