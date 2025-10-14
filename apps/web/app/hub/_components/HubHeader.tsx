import { User } from "better-auth";
import CreateArenaBtn from "@/components/buttons/CreateArenaBtn";

interface HubHeaderProps {
    user: User;
}

export default async function HubHeader({ user }: HubHeaderProps) {
    const { name: userName } = user
    return (
        <div className=' w-full max-w-7xl mx-auto py-5'>
            <div className="flex items-center justify-between p-8 bg-muted rounded-2xl">
                <div className='flex flex-col gap-2'>
                    <h1>
                        Welcome back, {userName.split(" ")[0]}👋
                    </h1>
                    <p>
                        Manage your arenas and connect with your team
                    </p>
                </div>
                <CreateArenaBtn user={user} />
            </div>
        </div>
    )
}
