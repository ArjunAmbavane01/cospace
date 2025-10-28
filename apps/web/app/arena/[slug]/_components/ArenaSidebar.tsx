import { Dispatch, ReactNode, SetStateAction, useState } from "react"
import { cn } from "@/lib/utils";
import { Tabs } from "./ArenaClient";
import { Settings } from "lucide-react"
import { CiMap } from "react-icons/ci"
import { PiChatsCircle } from "react-icons/pi";

interface ArenaSidebarProps {
    activeTab: Tabs,
    setActiveTab: Dispatch<SetStateAction<Tabs>>
}

export default function ArenaSidebar({ activeTab, setActiveTab }: ArenaSidebarProps) {
    return (
        <div className="flex flex-col gap-3 w-fit px-2">
            <NavItem title="map" activeTab={activeTab} setActiveTab={setActiveTab} icon={<CiMap className="size-6" />} />
            <NavItem title="chat" activeTab={activeTab} setActiveTab={setActiveTab} icon={<PiChatsCircle className="size-6" />} />
            <NavItem title="setting" activeTab={activeTab} setActiveTab={setActiveTab} icon={<Settings className="size-6" />} />
        </div>
    )
}

function NavItem({ title, icon, activeTab, setActiveTab }: {
    title: Tabs,
    icon: ReactNode,
    activeTab: Tabs,
    setActiveTab: Dispatch<SetStateAction<Tabs>>
}) {
    const isActive = title === activeTab;
    return <div
        onClick={() => setActiveTab(title)}
        className={cn(
            "flex justify-center items-center size-10 rounded-lg cursor-pointer transition",
            isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
        )}>
        {icon}
    </div>
}
