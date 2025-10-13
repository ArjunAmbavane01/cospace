"use client"

import Image from "next/image";
import useAuth from "hooks/useAuth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Kbd } from "@/components/ui/kbd";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, UserCircle2 } from "lucide-react";

interface UserMenuProps {
    userName: string;
    userImage: string | undefined | null;
}

export default function UserMenu({ userName, userImage }: UserMenuProps) {

    const { logout } = useAuth();
    const userInitials = userName.split(" ").map(w => w[0]).join("");

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex justify-center items-center size-9 rounded-full border cursor-pointer hover:opacity-90 transition-opacity duration-200 overflow-hidden">
                {
                    userImage ?
                        <Image src={userImage} alt="User image" width={40} height={40} className="size-full" />
                        :
                        <Avatar className="size-full rounded-full">
                            <AvatarImage src={userImage ?? undefined} alt="User image" />
                            <AvatarFallback>{userInitials}</AvatarFallback>
                        </Avatar>
                }
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <UserCircle2 className="size-4" />
                        Profile
                    </div>
                    <div className="flex items-center gap-1">
                        <Kbd>⌘</Kbd><Kbd>P</Kbd>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={logout}
                    className="flex items-center gap-8 group">
                    <div className="flex items-center gap-2 group-hover:text-destructive">
                        <LogOut className="size-4" />
                        Log out
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
