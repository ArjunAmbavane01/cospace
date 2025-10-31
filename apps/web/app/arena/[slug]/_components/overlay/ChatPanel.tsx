import Image from "next/image";
import { ArenaUser } from "@/lib/validators/arena"
import ChatInput from "./chat/ChatInput";
import ChatArea from "./chat/ChatArea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatGroup } from "@/lib/validators/chat";
import { cn } from "@/lib/utils";

interface ChatPanelProps {
  activeGroup: ChatGroup | null;
}

export default function ChatPanel({ activeGroup }: ChatPanelProps) {

  const chatParticipant = activeGroup?.participants[0];
  if (!activeGroup || !chatParticipant) return (
    <div className='flex justify-center items-center absolute inset-0 bg-accent rounded-xl z-30'>
      <h4>
        Start a chat by selecting a user
      </h4>
    </div>
  )

  // // fetch top-50 messages and if activeGroupId id
  // const { data: userArenas, isLoading, isError } = useQuery({
  //   queryKey: ["chat-messages", chatParticipant.userId],
  //   queryFn: async () => {
  //     const res = await getChatMessages(chatParticipant.userId);
  //     if (res.type === "success") return res.userArenas
  //     else if (res.type === "error") toast.error(res.message)
  //   },
  //   staleTime: 60 * 1000 // 60 seconds
  // })

  const userInitials = chatParticipant.name.split(" ").map(w => w[0]).join("");

  return (
    <div className='flex flex-col absolute inset-0 bg-accent rounded-xl z-30'>
      <div className="flex justify-between h-fit p-5 border-b">
        <div className="flex items-center gap-3">
          <div className="flex justify-center items-center size-7 relative">
            <div className="absolute size-2.5 bg-accent bottom-0 right-0 rounded-full">
              <div className={cn(
                "absolute size-[9px] border bottom-0 right-0 rounded-full",
                chatParticipant.isOnline ? "bg-success" : "bg-muted"
              )} />
            </div>
            {
              chatParticipant.image ?
                <Image src={chatParticipant.image} alt="User image" width={40} height={40} className="size-full rounded-full" />
                :
                <Avatar className="size-full rounded-full">
                  <AvatarImage src={chatParticipant.image ?? undefined} alt="User image" />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
            }
          </div>
          {chatParticipant.name}
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-5 p-3">
        <ChatArea />
        <ChatInput chatParticipant={chatParticipant} activeGroup={activeGroup} />
      </div>
    </div>
  )
}
