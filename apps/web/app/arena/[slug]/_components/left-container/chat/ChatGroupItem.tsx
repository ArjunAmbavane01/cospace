import Image from "next/image";
import { formatDate } from "@/lib/formatDate";
import { cn } from "@/lib/utils";
import { ChatGroup } from "@/lib/validators/chat"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatGroupItemProps {
    group: ChatGroup;
}

export default function ChatGroupItem({ group }: ChatGroupItemProps) {
    const { lastMessage, participants, updatedAt } = group;
    const user = participants[0];
    if (!user) return;
    const userInitials = user.name.split(" ").map(w => w[0]).join("");
    return (
        <div className="flex items-center gap-2 w-full p-3">
            <div className="flex justify-center items-center size-8 relative">
                <div className="absolute size-2.5 bg-accent bottom-0 right-0 rounded-full">
                    <div className={cn(
                        "absolute size-[9px] border bottom-0 right-0 rounded-full",
                    )} />
                </div>
                {
                    user.image ?
                        <Image src={user.image as string} alt="User image" width={40} height={40} className="size-full rounded-full" />
                        :
                        <Avatar className="size-full rounded-full">
                            <AvatarImage src={user.image as string ?? undefined} alt="User image" />
                            <AvatarFallback>{userInitials}</AvatarFallback>
                        </Avatar>
                }
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center w-full">
                    <h4>
                        {user.name}
                    </h4>
                    <p>{formatDate(updatedAt)}</p>
                </div>
                <p>{lastMessage?.content}</p>
            </div>
        </div>
    )
}
