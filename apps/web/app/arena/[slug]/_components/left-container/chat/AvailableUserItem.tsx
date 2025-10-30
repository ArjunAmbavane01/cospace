import React, { Dispatch, SetStateAction } from 'react'
import Image from "next/image";
import { ArenaUser } from "@/lib/validators/game";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvailableUserItemProps {
    user: ArenaUser;
    setGroupId: (userId: string) => void;
    setOpenModal: Dispatch<SetStateAction<boolean>>

}

export default function AvailableUserItem({ user, setGroupId, setOpenModal }: AvailableUserItemProps) {
    const userInitials = user?.userName.split(" ").map(w => w[0]).join("");
    return <div
        className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-accent transition group cursor-pointer"
        onClick={() => {
            setGroupId(user.userId)
            setOpenModal(false);
        }}
    >
        <div className="flex items-center gap-3">
            <div className="flex justify-center items-center size-7 relative">
                {
                    user.userImage ?
                        <Image src={user.userImage} alt="User image" width={40} height={40} className="size-full rounded-full" />
                        :
                        <Avatar className="size-full rounded-full">
                            <AvatarImage src={user.userImage ?? undefined} alt="User image" />
                            <AvatarFallback>{userInitials}</AvatarFallback>
                        </Avatar>
                }
            </div>
            {user.userName}
        </div>
    </div>
}
