import { useCallback, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMessage } from "server/actions/chat";
import { User } from "better-auth";
import { ChatGroup, ChatGroupParticipant, MessagesInfiniteData } from "@/lib/validators/chat";
import { Message } from "@repo/schemas/arena-ws-events";
import TextareaAutosize from "react-textarea-autosize"
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BsEmojiSmile } from "react-icons/bs";
import { LuSendHorizontal } from "react-icons/lu";

interface ChatInputProps {
    slug: string;
    chatParticipant: ChatGroupParticipant;
    user: User;
    activeGroup: ChatGroup;
    sendMessage: (groupPublicId: string, message: Message) => void;
}

export default function ChatInput({ slug, chatParticipant, user, activeGroup, sendMessage }: ChatInputProps) {

    const [message, setMessage] = useState("");
    const [openEmojiPanel, setOpenEmojiPanel] = useState<boolean>(false);

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const queryClient = useQueryClient();

    const { mutateAsync: handleSendMessage, isPending: isSending } = useMutation({
        mutationFn: async (content: string) => {
            const res = await createMessage(activeGroup.publicId, content);
            if (res.type === "error") throw new Error(res.message);
            return res;
        },
        onMutate: async (content: string) => {
            // cancel outgoing refecthes
            await queryClient.cancelQueries({ queryKey: ["messages", activeGroup.publicId] })
            // save previous value
            const prevMessageData = queryClient.getQueryData<MessagesInfiniteData>(["messages", activeGroup.publicId]);
            const prevChatGroupsData = queryClient.getQueryData<ChatGroup[]>(["chat-groups", slug]);
            const optimisticMessage = {
                id: -1 * Date.now(),
                content,
                recieverId: chatParticipant.id,
                senderId: user.id,
                senderName: user.name,
                senderImage: user?.image,
                createdAt: new Date(),
            }

            queryClient.setQueryData<MessagesInfiniteData>(
                ["messages", activeGroup.publicId],
                (oldData) => {
                    if (!oldData || !user) return oldData;
                    const newPages = [...oldData.pages];
                    // Check if there are any pages at all
                    if (newPages[0]) {
                        // Append the optimistic message to end of first page
                        newPages[0] = {
                            ...newPages[0],
                            rows: [optimisticMessage, ...newPages[0].rows],
                        };
                    } else {
                        // if first message ever
                        newPages.push({ rows: [optimisticMessage] });
                    }
                    return {
                        pages: newPages,
                        pageParams: oldData.pageParams,
                    };
                }
            );

            queryClient.setQueryData<ChatGroup[]>(
                ["chat-groups", slug],
                (oldData) => {
                    if (!oldData) return oldData;
                    let targetGroup: ChatGroup | undefined;
                    const otherGroups: ChatGroup[] = [];

                    for (const group of oldData) {
                        if (group.publicId === activeGroup.publicId) {
                            targetGroup = group;
                        } else {
                            otherGroups.push(group);
                        }
                    }
                    if (!targetGroup) return oldData;
                    const updatedGroup = {
                        ...targetGroup,
                        lastMessage: {
                            content: optimisticMessage.content,
                            createdAt: optimisticMessage.createdAt,
                        }
                    };

                    // updated group at the top
                    return [updatedGroup, ...otherGroups];
                }
            )
            setMessage("");
            return { prevMessageData, prevChatGroupsData };
        },
        onSuccess: (res) => {
            sendMessage(activeGroup.publicId, res.createdMessage);
        },
        onError: (err, _, context) => {
            // restore previous state
            if (context?.prevMessageData) {
                queryClient.setQueryData(
                    ["messages", activeGroup.publicId],
                    context.prevMessageData
                );
            }
            if (context?.prevChatGroupsData) {
                queryClient.setQueryData(
                    ["chat-groups", slug],
                    context.prevChatGroupsData
                );
            }
            toast.error(err.message || "Failed to send message");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["messages", activeGroup.publicId] })
        },
    })

    const onEmojiSelect = useCallback(({ emoji }: { emoji: string }) => {
        setMessage(prev => prev + emoji);
        textareaRef.current?.focus();
    }, [setMessage]);

    const handleMessageInput = useCallback(async () => {
        try {
            if (isSending) return;
            if (!message.trim()) {
                textareaRef.current?.focus();
                return;
            }
            await handleSendMessage(message);
        } catch (err) {
            console.error(err);
            toast.error(err instanceof Error ? err.message : "Something went wrong");
        }
    }, [handleSendMessage, isSending, message]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // new line on Shift+Enter
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleMessageInput();
        }
    }, [handleMessageInput]);

    return (
        <div className="min-h-24 p-3 mx-3 mb-2 bg-input/30 rounded-xl relative">
            <TextareaAutosize
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                maxRows={6}
                data-slot="input-group-control"
                className="flex field-sizing-content min-h-12 w-full resize-none rounded-xl bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none"
                placeholder={`Message ${chatParticipant.name}`}
            />
            <div className="flex items-center gap-2 absolute bottom-3 right-3">
                <div className="relative">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="icon"
                                variant="ghost"
                                type="button"
                                onClick={() => setOpenEmojiPanel(c => !c)}
                            >
                                <BsEmojiSmile />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            Pick an emoji
                        </TooltipContent>
                    </Tooltip>
                    {openEmojiPanel && (
                        <EmojiPicker
                            onEmojiClick={onEmojiSelect}
                            width={300}
                            height={350}
                            theme={"dark" as Theme}
                            className="!absolute !bottom-full !right-0 z-50"
                        />
                    )}
                </div>
                <Button
                    size="icon"
                    variant="default"
                    onClick={handleMessageInput}
                    disabled={isSending || !message.trim()}
                    type="button"
                >
                    <LuSendHorizontal />
                </Button>
            </div>
        </div>
    )
}
