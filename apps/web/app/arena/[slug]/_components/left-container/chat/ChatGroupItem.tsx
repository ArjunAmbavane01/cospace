import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/formatDate";
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
        <div className="flex items-start gap-3 w-full p-2 rounded-lg hover:bg-muted-foreground/10 cursor-pointer transition">
            <div className="flex justify-center items-center size-9 shrink-0 relative">
                <div className="absolute size-2.5 bg-accent bottom-0 right-0 rounded-full">
                    <div className={cn(
                        "absolute size-[9px] border bottom-0 right-0 rounded-full",
                    )} />
                </div>
                {
                    user.image ?
                        <Image src={user.image as string} alt="User image" width={36} height={36} className="size-9 rounded-full object-cover" />
                        :
                        <Avatar className="size-9 rounded-full">
                            <AvatarImage src={user.image as string ?? undefined} alt="User image" />
                            <AvatarFallback>{userInitials}</AvatarFallback>
                        </Avatar>
                }
            </div>

            <div className="flex flex-col w-full">
                <div className="flex justify-between items-center w-full">
                    <h5>
                        {user.name}
                    </h5>
                    <h6>{formatDate(updatedAt, "message")}</h6>
                </div>
                <p>{lastMessage?.content || "hey there"}</p>
            </div>
        </div>
    )
}
