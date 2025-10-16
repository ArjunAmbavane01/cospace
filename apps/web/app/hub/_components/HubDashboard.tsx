import type { User } from "better-auth";
import Navbar from "@/components/navbar/Navbar";
import HubHeader from "./HubHeader";
import ArenaList from "./ArenaList";

interface HubDashboardProps {
    user: User;
}

export default function HubDashboard({ user }: HubDashboardProps) {
    return (
        <div className='pt-24 bg-background w-full min-h-screen relative'>
            <Navbar user={user} />
            <div className="flex flex-col gap-5 w-full max-w-7xl mx-auto space-y-10">
                <HubHeader user={user} />
                <ArenaList userId={user.id} />
            </div>
        </div>
    )
}
