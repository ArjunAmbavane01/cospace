import Image from "next/image";
import useAuth from "hooks/useAuth";
import useAuthStore from "store/authStore";
import UserMenuSkeleton from "./UserMenuSkeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Kbd } from "@/components/ui/kbd";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, UserCircle2 } from "lucide-react";

export default function UserMenu() {
    const { logout } = useAuth();
    const { user } = useAuthStore();
    if (!user) return <UserMenuSkeleton />;
    const userInitials = user?.name.split(" ").map(w => w[0]).join("");
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 p-2 px-3 rounded-lg hover:bg-accent transition cursor-pointer">
                    <div className="flex justify-center items-center size-7 rounded-full overflow-hidden">
                        {
                            user.image ?
                                <Image src={user.image} alt="User image" width={40} height={40} className="size-full" />
                                :
                                <Avatar className="size-full rounded-full">
                                    <AvatarImage src={user.image ?? undefined} alt="User image" />
                                    <AvatarFallback>{userInitials}</AvatarFallback>
                                </Avatar>
                        }
                    </div>
                    {user.name}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-44">
                <DropdownMenuItem className="flex items-center justify-between gap-8">
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
