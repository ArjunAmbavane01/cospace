import Image from "next/image";
import { ArenaUser } from "@/lib/validators/game"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";

interface UserBtnProps {
  user: ArenaUser;
  setOpenChat: Dispatch<SetStateAction<boolean>>;
}
export default function UserBtn({ user, setOpenChat }: UserBtnProps) {
  const userInitials = user?.userName.split(" ").map(w => w[0]).join("");
  return (
    <div className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-accent transition cursor-pointer group">
      <div className="flex items-center gap-3">
        <div className="flex justify-center items-center size-7 relative">
          <div className="absolute size-2.5 bg-accent bottom-0 right-0 rounded-full">
            <div className="absolute size-[9px] bg-success border bottom-0 right-0 rounded-full" />
          </div>
          {
            user.userImage ?
              <Image src={user.userImage} alt="User image" width={40} height={40} className="size-full rounded-full" />
              :
              <Avatar className="size-full rounded-full">
                <AvatarImage src={user.userImage ?? undefined} alt="User image" />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
          }
        </div>
        {user.userName}
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-all">
        <Button size={"sm"} variant={"outline"} onClick={() => setOpenChat(true)}>
          Chat
        </Button>
      </div>
    </div>
  )
}
