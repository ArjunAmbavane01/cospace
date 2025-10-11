"use client"

import useAuth from "hooks/useAuth";
import type { User } from "better-auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Kbd } from "@/components/ui/kbd";
import { Avatar } from "@/components/ui/avatar";
import { ChevronDown, LogOut, UserCircle2 } from "lucide-react";
import Image from "next/image";

interface UserMenuProps {
    user: User;
}

export default function UserMenu({ user }: UserMenuProps) {

    const { logout } = useAuth();
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 p-2 px-3 rounded-lg border hover:bg-accent/50">
                    {
                        user?.image ?
                            <Image src={user.image} alt="User image" width={40} height={40} className="size-6 rounded-full border" />
                            :
                            <Avatar />
                    }
                    <h4>
                    {user.name}
                    </h4>
                    <ChevronDown size={16} />
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
        </div>
    )
}
