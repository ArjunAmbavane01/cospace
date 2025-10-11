import Navbar from "@/components/navbar/Navbar";
import type { User } from "better-auth";
import ArenaList from "./ArenaList";
import DashboardHeader from "./DashboardHeader";

interface DashboardProps {
    user: User;
}

export default function Dashboard({ user }: DashboardProps) {
    return (
        <div className='pt-24 bg-background w-full min-h-screen relative'>
            <Navbar user={user} />
            <div className="space-y-10">
                <DashboardHeader />
            <ArenaList />
            </div>
        </div>
    )
}
