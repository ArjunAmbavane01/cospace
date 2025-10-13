import { Arena } from "@/lib/validators/arena";
import { db } from "@repo/db/client";
import { User } from "better-auth";
import { EllipsisVertical, UserCircle2, Users2 } from "lucide-react";
import Image from "next/image";

interface ArenaCardProps {
    arenaWithUsers: {
        arena: Arena,
        adminUser: User | undefined,
        usersCount: number,
    }
}
export default async function ArenaCard({ arenaWithUsers }: ArenaCardProps) {
    const { arena, adminUser, usersCount } = arenaWithUsers;
    const arenaCreatedDay = new Date().getDate() == arena.createdAt.getDate() ? "today" : arena.createdAt;
    return (
        <div className="flex flex-col gap-3 bg-card w-72 h-60 rounded-lg border relative overflow-hidden group">
            <div className="w-full h-40 border relative overflow-hidden z-10">
                <div className="absolute top-2 left-2 flex items-center gap-2 p-1 px-2 bg-muted/80 group-hover:bg-muted rounded-full z-20">
                    <Users2 size={12} />
                    <h6>{usersCount}</h6>
                </div>
                <div className="opacity-0 absolute top-2 right-2 group-hover:opacity-100 flex items-center gap-2 p-1 bg-muted rounded cursor-pointer transition-opacity duration-200 z-20">
                    <EllipsisVertical size={16} />
                </div>
                <Image
                    src={"/assets/arena-placeholder.png"}
                    alt="Arena placeholder"
                    fill
                    className="object-cover"
                />
            </div>
            <div className="flex justify-between items-center h-20 p-3">
                <h5 className="flex items-center gap-1">
                    <UserCircle2 size={16} />
                    {adminUser?.name}
                </h5>
                <h5>
                    {arenaCreatedDay.toString()}
                </h5>
            </div>
        </div>
    )
}
