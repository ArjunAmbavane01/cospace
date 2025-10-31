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
                "flex items-start gap-3 w-full p-2 rounded-lg hover:bg-muted-foreground/10 cursor-pointer transition",
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

            <div className="flex flex-col w-full">
                <div className="flex justify-between items-center w-full">
                    <h5>
                        {chatParticipant.name}
                    </h5>
                    <h6>{lastMessage && formatDate(lastMessage?.createdAt, "message")}</h6>
                </div>
                <p>{lastMessage?.content}</p>
            </div>
        </div>
    )
}
