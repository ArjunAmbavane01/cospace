import type { User } from "better-auth";
import ArenaList from "./ArenaList";
import HubHeader from "./HubHeader";
import Navbar from "@/components/navbar/Navbar";

interface HubDashboardProps {
    user: User;
}

export default function HubDashboard({ user }: HubDashboardProps) {
    return (
        <div className='pt-24 bg-background w-full min-h-screen relative'>
            <Navbar userName={user.name} userImage={user.image} />
            <div className="space-y-10">
                <HubHeader userName={user.name} userId={user.id} />
                <ArenaList userId={user.id} />
            </div>
        </div>
    )
}
