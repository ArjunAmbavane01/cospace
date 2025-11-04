import Image from "next/image";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { getChatGroupMessages } from "server/actions/chat";
import { ChatGroup, MessagePage } from "@/lib/validators/chat";
import { cn } from "@/lib/utils";
import { User } from "better-auth";
import { Tabs } from "../ArenaLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ChatInput from "./chat/ChatInput";
import ChatArea from "./chat/ChatArea";

interface ChatPanelProps {
  slug: string;
  activeGroup: ChatGroup | null;
  activeTab: Tabs;
  user: User;
  handleCloseChat: () => void;
}

const MAX_PAGE_SIZE = 35; // 35 messages

export default function ChatPanel({ slug, activeGroup, activeTab, user, handleCloseChat }: ChatPanelProps) {

  const infiniteQuery = useInfiniteQuery<
    MessagePage,
    Error,
    InfiniteData<MessagePage, number>,
    [string, string],
    number
  >({
    queryKey: ['messages', activeGroup?.publicId ?? "null-group"],
    queryFn: async (ctx: { pageParam: number }): Promise<MessagePage> => {
      const offset = ctx.pageParam * MAX_PAGE_SIZE;
      const res = await getChatGroupMessages(activeGroup!.publicId, MAX_PAGE_SIZE, offset);
      if (res.type === "error") throw new Error(res.message);
      return res.groupMessages;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: MessagePage, allPages: MessagePage[]) => {
      // check if last page had less then 50 messages
      if (lastPage.rows.length < MAX_PAGE_SIZE) return undefined;
      return allPages.length; // next page num
    },
    enabled: !!activeGroup?.publicId && !!user,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });

  const chatParticipant = activeGroup?.participants[0];

  if (!user) return null;
  if (!chatParticipant || !activeGroup) return (
    <div className={cn(
      'flex justify-center items-center absolute inset-0 bg-accent rounded-xl z-30',
      activeTab === "chat" ? "flex" : "hidden"
    )}>
      <h4>
        Start a chat by selecting a user
      </h4>
    </div>
  )

  const allMessages = infiniteQuery.data ? infiniteQuery.data.pages.flatMap(page => page.rows).reverse() : [];
  const userInitials = chatParticipant.name.split(" ").map(w => w[0]).join("");

  return (
    <div className={cn(
      "flex-col absolute inset-0 bg-accent rounded-xl z-30",
      activeTab === "chat" ? "flex" : "hidden"
    )}>
      <div className="flex justify-between h-fit p-3 px-5 border-b">
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
        <div className="flex items-center gap-2">
          <Button
            onClick={handleCloseChat}
            variant={"secondary"}
          >
            Close
          </Button>

        </div>
      </div>
      <div className="flex-1 flex flex-col gap-5 p-3 min-h-0">
        <ChatArea
          key={activeGroup.publicId}
          infiniteQuery={infiniteQuery}
          allMessages={allMessages}
          user={user}
        />
        <ChatInput
          slug={slug}
          chatParticipant={chatParticipant}
          user={user}
          activeGroup={activeGroup}
        />
      </div>
    </div>
  )
}
