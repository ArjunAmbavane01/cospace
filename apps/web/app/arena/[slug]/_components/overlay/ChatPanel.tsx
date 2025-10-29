import { ArenaUser } from "@/lib/validators/game"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import ChatInput from "./chat/ChatInput";
import ChatArea from "./chat/ChatArea";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface ChatPanelProps {
  activeChatUser: ArenaUser | null;
}

export default function ChatPanel({ activeChatUser }: ChatPanelProps) {
  if (!activeChatUser) return (
    <div className='flex justify-center items-center absolute inset-0 bg-accent rounded-xl z-30'>
      Select a user to chat with
    </div>
  )

  // // fetch top-50 messages
  // const { data: userArenas, isLoading, isError } = useQuery({
  //   queryKey: ["chat-messages", activeChatUser.userId],
  //   queryFn: async () => {
  //     const res = await getChatMessages(activeChatUser.userId);
  //     if (res.type === "success") return res.userArenas
  //     else if (res.type === "error") toast.error(res.message)
  //   },
  //   staleTime: 60 * 1000 // 60 seconds
  // })

  const userInitials = activeChatUser?.userName.split(" ").map(w => w[0]).join("");

  return (
    <div className='flex flex-col absolute inset-0 bg-accent rounded-xl z-30'>
      <div className="flex justify-between h-fit p-5 border-b">
        <div className="flex items-center gap-3">
          <div className="flex justify-center items-center size-7 relative">
            <div className="absolute size-2.5 bg-accent bottom-0 right-0 rounded-full">
              <div className="absolute size-[9px] bg-success border bottom-0 right-0 rounded-full" />
            </div>
            {
              activeChatUser.userImage ?
                <Image src={activeChatUser.userImage} alt="User image" width={40} height={40} className="size-full rounded-full" />
                :
                <Avatar className="size-full rounded-full">
                  <AvatarImage src={activeChatUser.userImage ?? undefined} alt="User image" />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
            }
          </div>
          {activeChatUser.userName}
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-5 p-3">
        <ChatArea />
        <ChatInput activeChatUser={activeChatUser} />
      </div>
    </div>
  )
}
