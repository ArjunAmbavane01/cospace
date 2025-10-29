import { useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize"
import { ArenaUser } from "@/lib/validators/game";
import { InputGroup, InputGroupAddon, InputGroupButton } from "@/components/ui/input-group"
import { EmojiPicker, EmojiPickerSearch, EmojiPickerContent, EmojiPickerFooter } from "@/components/ui/emoji-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { LuSendHorizontal } from "react-icons/lu";
import { BsEmojiSmile } from "react-icons/bs";

interface ChatInputProps {
    activeChatUser: ArenaUser | null;
}

export default function ChatInput({ activeChatUser }: ChatInputProps) {
    const [openEmojiPanel, setOpenEmojiPanel] = useState<boolean>(false);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const onEmojiSelect = ({ emoji }: { emoji: string }) => {
        if (!textareaRef.current) return;
        textareaRef.current.value += emoji;
        textareaRef.current.focus();
    }

    const sendMessage = () => {
        if (!textareaRef.current) return;
        if (textareaRef.current.value.trim() === "") textareaRef.current.focus();
        
    }

    return (
        <InputGroup>
            <TextareaAutosize
                ref={textareaRef}
                maxRows={6}
                data-slot="input-group-control"
                className="flex field-sizing-content min-h-12 w-full resize-none rounded-xl bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none"
                placeholder={`Message ${activeChatUser?.userName}`}
            />
            <InputGroupAddon align="block-end" className="flex items-center justify-end gap-2">
                <Popover onOpenChange={setOpenEmojiPanel} open={openEmojiPanel}>
                    <PopoverTrigger asChild>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <InputGroupButton size="icon-sm" variant="ghost" onClick={() => setOpenEmojiPanel(c => !c)}>
                                    <BsEmojiSmile />
                                </InputGroupButton>
                            </TooltipTrigger>
                            <TooltipContent>
                                Pick an emoji
                            </TooltipContent>
                        </Tooltip>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit p-0 -translate-x-8">
                        <EmojiPicker
                            className="h-[342px]"
                            onEmojiSelect={onEmojiSelect}
                        >
                            <EmojiPickerSearch />
                            <EmojiPickerContent />
                            <EmojiPickerFooter />
                        </EmojiPicker>
                    </PopoverContent>
                </Popover>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <InputGroupButton size="icon-sm" variant="default" onClick={sendMessage}>
                            <LuSendHorizontal />
                        </InputGroupButton>
                    </TooltipTrigger>
                    <TooltipContent>
                        Send
                    </TooltipContent>
                </Tooltip>
            </InputGroupAddon>
        </InputGroup>
    )
}
