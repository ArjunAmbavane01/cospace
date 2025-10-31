import { useMemo, useRef, useState } from "react";
import { ArenaUser } from "@/lib/validators/arena";
import AvailableUsersList from "./AvailableUsersList";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiEdit } from "react-icons/fi";

interface NewChatDialogProps {
    arenaUsers: ArenaUser[];
    isCreatingGroup: boolean;
    handleSelectGroup: (userId: string) => Promise<void>;
}

export default function NewChatDialog({ arenaUsers, handleSelectGroup, isCreatingGroup }: NewChatDialogProps) {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const inputRef = useRef<HTMLInputElement | null>(null);

    const filteredArenas = useMemo(() => {
        if (!arenaUsers) return [];
        return arenaUsers.filter((user) => {
            if (!user?.name) return false;
            return user.name.toLowerCase().includes(searchQuery.toLowerCase());
        })
    }, [searchQuery, arenaUsers]);

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
                <Input
                    ref={inputRef}
                    onChange={(e) => (setSearchQuery(e.target.value.trim()))}
                    placeholder="Search users"
                />
                <AvailableUsersList
                    arenaUsers={filteredArenas}
                    searchQuery={searchQuery}
                    isCreatingGroup={isCreatingGroup}
                    handleSelectGroup={handleSelectGroup}
                    setOpenModal={setOpenModal}
                />
            </DialogContent>
        </Dialog>
    )
}
