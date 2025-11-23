import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createChatGroup, getChatGroups } from "server/actions/chat";
import { ArenaUser } from "@/lib/validators/arena";
import { ChatGroup } from "@/lib/validators/chat";
import ChatGroupsPanelSkeleton from "./ChatGroupsPanelSkeleton";
import ChatGroupItem from "./ChatGroupItem";
import NewChatDialog from "./NewChatDialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ChatGroupsPanelProps {
    arenaUsers: ArenaUser[];
    slug: string;
    socket: Socket | null;
    activeGroup: ChatGroup | null;
    activeChatUserId: string | null;
    setActiveChatUserId: Dispatch<SetStateAction<string | null>>;
    setActiveGroup: Dispatch<SetStateAction<ChatGroup | null>>;
}
export default function ChatGroupsPanel({
    arenaUsers,
    slug,
    socket,
    activeGroup,
    activeChatUserId,
    setActiveChatUserId,
    setActiveGroup
}: ChatGroupsPanelProps) {

    const [searchQuery, setSearchQuery] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);

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

    // send all group ids user is part of
    useEffect(() => {
        if (!socket || !chatGroups) return;
        socket.emit("chat-groups", {
            chatGroupIds: chatGroups.map((g) => g.publicId)
        })
    }, [chatGroups]);

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

    // set online status of participants in chatGroups
    useEffect(() => {
        (async () => {
            if (chatGroups) {
                const updatedGroups = chatGroups.map(group => ({
                    ...group,
                    participants: group.participants.map(p => {
                        const user = arenaUsers.find(a => a.id === p.id);
                        return { ...p, isOnline: user?.isOnline ?? false }
                    })
                }))
                await queryClient.setQueryData(["chat-groups", slug], updatedGroups)
            }
        })();
    }, [arenaUsers, chatGroups, slug,]);

    const filteredGroups = useMemo(() => {
        if (!chatGroups) return [];
        return chatGroups.filter((group) =>
            group.participants
                .map((p) => p.name?.toLowerCase())
                .join(" ")
                .includes(searchQuery.toLowerCase())
        );
    }, [chatGroups, searchQuery]);

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
            Failed to fetch chats. Please try again.
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
            <Input
                ref={inputRef}
                placeholder="Search chats"
                onChange={(e) => setSearchQuery(e.target.value.trim())}
            />
            <div className="flex flex-col gap-3">
                {
                    chatGroups.length === 0 ? (
                        <div className="flex justify-center items-center h-40 p-5 text-muted-foreground text-center border border-dashed rounded-xl">
                            <h4>No chats yet. Start a conversation.</h4>
                        </div>
                    ) : filteredGroups.length === 0 && searchQuery ? (
                        <div className="flex justify-center items-center h-40 p-5 text-muted-foreground text-center border border-dashed rounded-xl break-all">
                            No chats match &quot;{searchQuery.slice(0, 20)}{searchQuery.length > 20 ? "…" : ""}&quot;.
                        </div>
                    ) : (
                        filteredGroups.map(group =>
                            <ChatGroupItem
                                key={`chatGroup-${group.publicId}`}
                                group={group}
                                activeGroup={activeGroup}
                                handleSelectGroup={handleSelectGroup}
                            />
                        )
                    )
                }
            </div>
        </div >
    )
}
