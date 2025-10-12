import Navbar from "@/components/navbar/Navbar";
import type { User } from "better-auth";
import ArenaList from "./ArenaList";
import HubHeader from "./HubHeader";

interface HubDashboardProps {
    user: User;
}

export default function HubDashboard({ user }: HubDashboardProps) {
    return (
        <div className='pt-24 bg-background w-full min-h-screen relative'>
            <Navbar user={user} />
            <div className="space-y-10">
                <HubHeader />
                <ArenaList />
            </div>
        </div>
    )
}
