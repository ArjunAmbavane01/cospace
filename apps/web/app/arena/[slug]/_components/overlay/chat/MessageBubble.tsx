import { User } from "better-auth"
import { format } from "date-fns";
import { Message } from "@/lib/validators/chat"
import { cn } from "@/lib/utils"

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
        "flex items-center max-w-[70%] pr-9 pl-3 py-2 pb-3 relative",
        message.senderId === user.id
          ? "bg-indigo-800 rounded-xl rounded-br-none"
          : "bg-background rounded-xl rounded-bl-none"
      )}>
        <h5 className={cn(
          "text-sm break-words whitespace-pre-wrap",
          message.senderId !== user.id && "text-primary"
        )}>
          {message.content}
        </h5>
        <h6 className="absolute bottom-1 right-1 text-[10px] text-muted-foreground">
          {timeString}
        </h6>
      </div>
    </div>
  )
}
