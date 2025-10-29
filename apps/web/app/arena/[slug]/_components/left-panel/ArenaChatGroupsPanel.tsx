import { Dispatch, SetStateAction } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "better-auth"
import { toast } from "sonner";
import { getChatGroups } from "server/actions/chat";
import { ArenaUser } from "@/lib/validators/game";
import ChatGroupBtn from "./ChatGroupBtn";

interface ArenaChatGroupsPanelProps {
    user: User;
    slug: string;
    setActiveChatUser: Dispatch<SetStateAction<ArenaUser | null>>;

}
export default function ArenaChatGroupsPanel({ user, slug, setActiveChatUser }: ArenaChatGroupsPanelProps) {
    //fetch all chat groups user is part of 
    const { data: chatGroups, isLoading, isError } = useQuery({
        queryKey: ["chat-groups", user.id],
        queryFn: async () => {
            const res = await getChatGroups(slug);
            if (res.type === "success") return res.chatGroups
            else if (res.type === "error") toast.error(res.message)
        },
        staleTime: 60 * 1000 // 60 seconds
    })
    if (!chatGroups) return (
        <div>
            Failed to fetch chats. Please try again
        </div>
    )
    console.log(chatGroups)
    if (chatGroups.length === 0) return (
        <div>
            Start chatting
        </div>
    )
    return (
        <div className="flex flex-col gap-2">
            {chatGroups.map(group => <ChatGroupBtn group={group} />)}
        </div>
    )
}
