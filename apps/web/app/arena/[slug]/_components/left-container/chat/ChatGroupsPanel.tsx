import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createChatGroup, getChatGroups } from "server/actions/chat";
import { ArenaUser } from "@/lib/validators/arena";
import ChatGroupItem from "./ChatGroupItem";
import ChatGroupsPanelSkeleton from "./ChatGroupsPanelSkeleton";
import NewChatDialog from "./NewChatDialog";
import { Kbd } from "@/components/ui/kbd";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { toast } from "sonner";
import { ChatGroup } from "@/lib/validators/chat";

interface ChatGroupsPanelProps {
    arenaUsers: ArenaUser[];
    slug: string;
    activeGroup: ChatGroup | null;
    activeChatUserId: string | null;
    setActiveChatUserId: Dispatch<SetStateAction<string | null>>;
    setActiveGroup: Dispatch<SetStateAction<ChatGroup | null>>;
}
export default function ChatGroupsPanel({ arenaUsers, slug, activeGroup, activeChatUserId, setActiveChatUserId, setActiveGroup }: ChatGroupsPanelProps) {

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
            const chatGroups = queryClient.getQueryData<ChatGroup[]>(["chat-groups", slug])
            const newGroup = chatGroups?.find(group => group.publicId === res.newMessageGroup.publicId);
            if (newGroup) setActiveGroup(newGroup);
            toast.success(res.message);
        },
        onError: (err) => {
            toast.error(err.message);
        },
    })

    // when user is selected, select its group
    useEffect(() => {
        if (activeChatUserId && chatGroups) {
            const existingGroup = chatGroups?.find(chatGroup => chatGroup.participants.find(p => p.id === activeChatUserId));
            if (!existingGroup) createChatGroupMutation({ slug, participantId: activeChatUserId })
            else setActiveGroup(existingGroup)
            setActiveChatUserId(null);
        };
    }, [activeChatUserId, chatGroups]);

    // fetching error effect
    useEffect(() => {
        if (isError && error) toast.error(error.message)
    }, [isError, error]);

    useEffect(() => {
        // set online status of participants in chatGroups
        (async () => {
            if (chatGroups) {
                const updatedGroups = chatGroups.map(chatGroup => chatGroup.participants.map(participant => {
                    const user = arenaUsers.find(a => a.id === participant.id);
                    return {
                        ...participant,
                        isOnline: user?.isOnline
                    }
                }))
                queryClient.setQueryData(["chat-groups", slug], updatedGroups)
            }
        })();
    }, [arenaUsers]);

    // sets ActiveGroupId, after checking if group already exists
    const handleSelectGroup = useCallback(async (participantId: string) => {
        if (!chatGroups) return;
        const existingGroup = chatGroups.find(chatGroup => chatGroup.participants.find(p => p.id === participantId));
        if (!existingGroup) await createChatGroupMutation({ slug, participantId })
        else setActiveGroup(existingGroup);
    }, [chatGroups, slug])

    if (isLoading) return <ChatGroupsPanelSkeleton />
    if (!chatGroups || isError) return (
        <div>
            Failed to fetch chats. Please try again
        </div>
    )
    return (
        <div className="flex flex-col gap-5 w-72 p-3 bg-accent rounded-xl">
            <div className="flex items-center justify-between px-1">
                <h3>
                    Chat
                </h3>
                <NewChatDialog
                    arenaUsers={arenaUsers}
                    handleSelectGroup={handleSelectGroup}
                    isCreatingGroup={isCreatingGroup}
                />
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
                            {chatGroups.map(group =>
                                <ChatGroupItem
                                    key={`chatGroup-${group.publicId}`}
                                    group={group}
                                    activeGroup={activeGroup}
                                    handleSelectGroup={handleSelectGroup}
                                />)
                            }
                        </>
                    )
                }
            </div>
        </div>
    )
}
