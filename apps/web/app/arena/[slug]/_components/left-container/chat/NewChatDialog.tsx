import { useState } from "react";
import { ArenaUser } from "@/lib/validators/game";
import AvailableUsersList from "./AvailableUsersList";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { FiEdit } from "react-icons/fi";

interface NewChatDialogProps {
    arenaUsers: ArenaUser[];
    setGroupId: (userId: string) => void;
}

export default function NewChatDialog({ arenaUsers,setGroupId}: NewChatDialogProps) {
    const [openModal, setOpenModal] = useState<boolean>(false);
    return (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button variant={"ghost"} size={"icon-sm"}>
                            <FiEdit />
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    New message
                </TooltipContent>
            </Tooltip>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Choose User to start chatting</DialogTitle>
                    <DialogClose />
                </DialogHeader>
                <AvailableUsersList arenaUsers={arenaUsers} setGroupId={setGroupId} setOpenModal={setOpenModal}/>
            </DialogContent>
        </Dialog>
    )
}
