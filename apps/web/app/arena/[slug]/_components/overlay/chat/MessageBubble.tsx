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
        "flex items-center max-w-[70%] pr-10 pl-2 py-1.5 relative",
        message.senderId === user.id
          ? "bg-blue-600 rounded-lg rounded-br-none"
          : "bg-primary rounded-lg rounded-bl-none"
      )}>
        <h5 className={cn(
          "break-words whitespace-pre-wrap",
          message.senderId === user.id
            ? "text-foreground"
            : "text-primary-foreground"
        )}>
          {message.content}
        </h5>
        <h6 className={cn(
          "absolute bottom-1 right-1 text-[10px] font-medium",
          message.senderId === user.id
            ? "text-foreground/80"
            : "text-primary-foreground/80"
        )}>
          {timeString}
        </h6>
      </div>
    </div>
  )
}
