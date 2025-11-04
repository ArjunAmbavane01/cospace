import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/formatDate";
import { ChatGroup } from "@/lib/validators/chat"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatGroupItemProps {
    group: ChatGroup;
    activeGroup: ChatGroup | null;
    handleSelectGroup: (userId: string) => void;
}

export default function ChatGroupItem({ group, activeGroup, handleSelectGroup }: ChatGroupItemProps) {
    const { lastMessage, participants } = group;
    if (!participants || !participants[0]) return;
    const chatParticipant = participants[0];
    const userInitials = chatParticipant.name.split(" ").map(w => w[0]).join("");

    const handleClick = () => handleSelectGroup(chatParticipant.id);
    return (
        <div
            className={cn(
                "flex items-start gap-3 w-full h-14 p-2 rounded-lg hover:bg-muted-foreground/10 cursor-pointer relative transition",
                activeGroup?.publicId === group.publicId && "bg-muted-foreground/20"
            )}
            onClick={handleClick}
        >
            <div className="flex justify-center items-center size-9 shrink-0 relative">
                <div className="absolute size-2.5 bg-accent bottom-0 right-0 rounded-full">
                    <div className={cn(
                        "absolute size-[9px] border bottom-0 right-0 rounded-full",
                        chatParticipant.isOnline ? "bg-success" : "bg-muted"
                    )} />
                </div>
                {
                    chatParticipant.image ?
                        <Image src={chatParticipant.image as string} alt="User image" width={36} height={36} className="size-9 rounded-full object-cover" />
                        :
                        <Avatar className="size-9 rounded-full">
                            <AvatarImage src={chatParticipant.image as string ?? undefined} alt="User image" />
                            <AvatarFallback>{userInitials}</AvatarFallback>
                        </Avatar>
                }
            </div>

            <h6 className="absolute top-1.5 right-3">{lastMessage && formatDate(lastMessage?.createdAt, "message")}</h6>
            <div className="flex flex-col flex-1 min-w-0">
                <h5 className="w-full max-w-[150px] text-ellipsis break-words whitespace-nowrap overflow-hidden">
                    {chatParticipant.name}
                </h5>
                <p className="truncate text-sm text-muted-foreground">
                    {lastMessage?.content}
                </p>
            </div>
        </div>
    )
}
