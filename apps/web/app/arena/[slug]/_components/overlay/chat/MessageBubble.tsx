import { User } from "better-auth"
import { format } from "date-fns";
import { cn } from "@/lib/utils"
import { Message } from "@repo/schemas/arena-ws-events";

interface MessageBubbleProps {
  message: Message,
  user: User,
}

export default function MessageBubble({ message, user }: MessageBubbleProps) {

  // 24-hour time
  const timeString = message.createdAt
    ? format(new Date(message.createdAt), "HH:mm")
    : '';

  return (
    <div className={cn(
      "flex w-full px-4 py-1",
      message.senderId === user.id ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "flex items-center max-w-[70%] pr-10 pl-2 py-1.5 relative",
        message.senderId === user.id
          ? "bg-blue-600 rounded-lg rounded-br-none"
          : "bg-[#e5e5e5] rounded-lg rounded-bl-none"
      )}>
        <h5 className={cn(
          "break-words whitespace-pre-wrap",
          message.senderId === user.id
            ? "text-white"
            : "text-black"
        )}>
          {message.content}
        </h5>
        
        <h6 className={cn(
          "absolute bottom-1 right-1.5 text-[10px] font-medium",
          message.senderId === user.id
            ? "text-white/80"
            : "text-black/80"
        )}>
          {timeString}
        </h6>
      </div>
    </div>
  )
}
