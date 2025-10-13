"use client"

import CreateArenaBtn from "@/components/buttons/CreateArenaBtn";

interface HubHeaderProps {
    userName: string;
    userId: string;
}

export default function HubHeader({ userName, userId }: HubHeaderProps) {
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
                <CreateArenaBtn userId={userId} />
            </div>
        </div>
    )
}
