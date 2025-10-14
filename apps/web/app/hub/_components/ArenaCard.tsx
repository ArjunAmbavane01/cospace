import Image from "next/image";
import { formatDate } from "@/lib/formatDate";
import { Arena } from "@/lib/validators/arena";
import { EllipsisVertical, UserCircle2, Users2 } from "lucide-react";

interface ArenaCardProps {
    arena: Arena
}

export default function ArenaCard({ arena }: ArenaCardProps) {
    const adminUser = arena.admin;
    const usersCount = arena.usersToArenas?.length;
    const formattedDate = formatDate(arena.createdAt);
    return (
        <div className="flex flex-col gap-3 bg-card w-72 h-60 rounded-lg border relative overflow-hidden group">
            <div className="w-full h-40 border relative overflow-hidden z-10">
                <div className="absolute top-2 left-2 flex items-center gap-2 p-1 px-2 bg-muted/80 group-hover:bg-muted rounded-full z-20">
                    <Users2 size={12} />
                    <h6>{usersCount || 0}</h6>
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
            <div className="flex flex-col h-20 p-3">
                <div>
                    {arena.name}
                </div>
                <div className="flex justify-between items-center">
                    <h5 className="flex items-center gap-1">
                        <UserCircle2 size={16} />
                        {adminUser?.name}
                    </h5>
                    <h5>
                        {formattedDate}
                    </h5>
                </div>
            </div>
        </div>
    )
}
