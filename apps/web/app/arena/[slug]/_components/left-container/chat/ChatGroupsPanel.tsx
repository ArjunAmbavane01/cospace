import { Dispatch, SetStateAction, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createChatGroup, getChatGroups } from "server/actions/chat";
import { ArenaUser } from "@/lib/validators/arena";
import ChatGroupItem from "./ChatGroupItem";
import ChatGroupsPanelSkeleton from "./ChatGroupsPanelSkeleton";
import NewChatDialog from "./NewChatDialog";
import { Kbd } from "@/components/ui/kbd";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { toast } from "sonner";

interface ChatGroupsPanelProps {
    arenaUsers: ArenaUser[];
    slug: string;
    setActiveChatUser: Dispatch<SetStateAction<ArenaUser | null>>;
    setActiveGroupId: Dispatch<SetStateAction<string | null>>;
}
export default function ChatGroupsPanel({ arenaUsers, slug, setActiveChatUser, setActiveGroupId }: ChatGroupsPanelProps) {


    const queryClient = useQueryClient();

    // fetch all chat groups user is part of 
    const { data: chatGroups, isLoading, isError, error } = useQuery({
        queryKey: ["chat-groups", slug],
        queryFn: async () => {
            const res = await getChatGroups(slug);
            if (res.type === "error") throw new Error(res.message);
            return res.chatGroups;
        },
        staleTime: 60 * 1000 // 60 seconds
    })

    // create message group mutation
    const { mutateAsync: createChatGroupMutation, isPending: isCreatingGroup } = useMutation({
        mutationFn: async ({ slug, participantId }: { slug: string; participantId: string }) => {
            const res = await createChatGroup(slug, participantId);
            if (res.type === "error") throw new Error(res.message);
            return res;
        },
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({ queryKey: ["chat-groups", slug] });
            setActiveGroupId(res.newMessageGroup.publicId);
            toast.success(res.message);
        },
        onError: (err) => {
            toast.error(err.message);
        },
    })

    console.log(chatGroups)
    // fetching error effect
    useEffect(() => {
        if (isError && error) toast.error(error.message)
    }, [isError, error]);

    if (isLoading) return <ChatGroupsPanelSkeleton />
    if (!chatGroups || isError) return (
        <div>
            Failed to fetch chats. Please try again
        </div>
    )

    // sets ActiveGroupId, after checking if group already exists
    const setGroupId = async (participantId: string) => {
        const existingGroupId = chatGroups.find(chatGroup => chatGroup.participants.find(p => p.id === participantId))?.publicId;
        if (!existingGroupId) await createChatGroupMutation({ slug, participantId })
        else setActiveGroupId(existingGroupId);
    }

    return (
        <div className="flex flex-col gap-5 w-72 p-3 bg-accent rounded-xl">
            <div className="flex items-center justify-between px-1">
                <h3>
                    Chat
                </h3>
                <NewChatDialog arenaUsers={arenaUsers} setGroupId={setGroupId} setActiveChatUser={setActiveChatUser} isCreatingGroup={isCreatingGroup} />
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
