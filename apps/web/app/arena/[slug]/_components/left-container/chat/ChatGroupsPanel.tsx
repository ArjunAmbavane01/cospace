import { Dispatch, SetStateAction } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createChatGroup, getChatGroups } from "server/actions/chat";
import { set, User } from "better-auth"
import { ChatGroup } from "@/lib/validators/chat";
import { ArenaUser } from "@/lib/validators/game";
import ChatGroupItem from "./ChatGroupItem";
import ChatGroupsPanelSkeleton from "./ChatGroupsPanelSkeleton";
import NewChatDialog from "./NewChatDialog";
import { Kbd } from "@/components/ui/kbd";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { toast } from "sonner";

interface ChatGroupsPanelProps {
    user: User;
    arenaUsers: ArenaUser[];
    slug: string;
    setActiveChatUser: Dispatch<SetStateAction<ArenaUser | null>>;
    setActiveGroup: Dispatch<SetStateAction<string | null>>;
}
export default function ChatGroupsPanel({ user, arenaUsers, slug, setActiveChatUser, setActiveGroup }: ChatGroupsPanelProps) {


    const queryClient = useQueryClient();


    // fetch all chat groups user is part of 
    const { data: chatGroups, isLoading, isError } = useQuery({
        queryKey: ["chat-groups", user.id],
        queryFn: async () => {
            const res = await getChatGroups(slug);
            if (res.type === "success") return res.chatGroups
            else if (res.type === "error") toast.error(res.message)
        },
        staleTime: 60 * 1000 // 60 seconds
    })

    // create message group mutation
    const { mutate: createChatGroupMutation, isPending: isCreating } = useMutation({
        mutationFn: ({ slug, participantId }: { slug: string; participantId: string }) => createChatGroup(slug, participantId),
        onSuccess: (res) => {
            if (res.type === "success" && res.newMessageGroup) {
                const existingGroups = queryClient.getQueryData<ChatGroup[]>(["chat-groups", user.id]) || [];
                setActiveGroup(res.newMessageGroup.publicId);
                queryClient.setQueryData(["chat-groups", user.id], [res.newMessageGroup, ...existingGroups]);
                toast.success(res.message);
            } else if (res.type === "error") toast.error(res.message);
        },
        onError: (err) => {
            toast.error(err instanceof Error ? err.message : "An unexpected error occurred.");
        },
    })


    if (isLoading) return <ChatGroupsPanelSkeleton />
    if (!chatGroups || isError) return (
        <div>
            Failed to fetch chats. Please try again
        </div>
    )

    const setGroupId = async (participantId: string) => {
        const existingGroupId = chatGroups.find(chatGroup => chatGroup.participants.find(p => p.id === participantId))?.publicId;
        if (!existingGroupId) createChatGroupMutation({slug, participantId})
        else setActiveGroup(existingGroupId);
    }

    return (
        <div className="flex flex-col gap-5 w-72 p-3 bg-accent rounded-xl">
            <div className="flex items-center justify-between px-1">
                <h3>
                    Chat
                </h3>
                <NewChatDialog arenaUsers={arenaUsers} setGroupId={setGroupId} />
            </div>
            <InputGroup>
                <InputGroupInput placeholder="Search chats" />
                <InputGroupAddon align={"inline-end"}>
                    <Kbd>Ctrl</Kbd><Kbd>F</Kbd>
                </InputGroupAddon>
            </InputGroup>
            <div className="flex flex-col gap-3">
                {
                    chatGroups.length === 0 ? (
                        <div>
                            Start Chatting
                        </div>
                    ) : (
                        <>
                            {chatGroups.map(group => <ChatGroupItem key={group.publicId} group={group} />)}
                        </>
                    )
                }
            </div>
        </div>
    )
}
