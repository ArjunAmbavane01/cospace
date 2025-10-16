"use client"

import Image from "next/image";
import useAuth from "hooks/useAuth";
import { User } from "better-auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Kbd } from "@/components/ui/kbd";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, UserCircle2 } from "lucide-react";
import { Button } from "../ui/button";

interface UserMenuProps {
    user: User
}

export default function UserMenu({ user }: UserMenuProps) {
    const { logout } = useAuth();
    const { name: userName, image: userImage } = user;
    const userInitials = userName.split(" ").map(w => w[0]).join("");

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size={"lg"} variant={"ghost"}>
                    <div className="flex justify-center items-center size-7 rounded-full border cursor-pointer hover:opacity-90 transition-opacity duration-200 overflow-hidden">
                        {
                            userImage ?
                                <Image src={userImage} alt="User image" width={40} height={40} className="size-full" />
                                :
                                <Avatar className="size-full rounded-full">
                                    <AvatarImage src={userImage ?? undefined} alt="User image" />
                                    <AvatarFallback>{userInitials}</AvatarFallback>
                                </Avatar>
                        }
                    </div>
                    {user.name}
                </Button>
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
