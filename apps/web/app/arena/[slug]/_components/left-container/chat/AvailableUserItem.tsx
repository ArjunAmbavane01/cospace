import React, { Dispatch, SetStateAction } from 'react'
import Image from "next/image";
import { ArenaUser } from "@/lib/validators/arena";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvailableUserItemProps {
    user: ArenaUser;
    isCreatingGroup: boolean;
    handleSelectGroup: (userId: string) => Promise<void>;
    setOpenModal: Dispatch<SetStateAction<boolean>>
}

export default function AvailableUserItem({ user, isCreatingGroup, handleSelectGroup, setOpenModal }: AvailableUserItemProps) {
    if (!user) return null;
    const userInitials = user.name.split(" ").map(w => w[0]).join("");
    return <div
        className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-accent transition group cursor-pointer"
        onClick={async () => {
            if (!isCreatingGroup) {
                await handleSelectGroup(user.id);
                setOpenModal(false);
            }
        }}
    >
        <div className="flex items-center gap-3">
            <div className="flex justify-center items-center size-7 relative">
                {
                    user.image ?
                        <Image src={user.image} alt="User image" width={40} height={40} className="size-full rounded-full" />
                        :
                        <Avatar className="size-full rounded-full">
                            <AvatarImage src={user.image ?? undefined} alt="User image" />
                            <AvatarFallback>{userInitials}</AvatarFallback>
                        </Avatar>
                }
            </div>
            {user.name}
        </div>
    </div>
}
