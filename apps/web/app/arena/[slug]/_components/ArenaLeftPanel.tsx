// import { Dispatch, SetStateAction, useState } from "react";
// import { User } from "better-auth";
// import { ArenaUser } from "@/lib/validators/game";
// import { Tabs } from './ArenaClient';
// import ArenaSidePanel from './left-panel/ArenaSidePanel';
// import ArenaSidebar from './left-panel/ArenaSidebar';

// interface ArenaLeftPanelProps {
//     user: User;
//     arenaUsers: ArenaUser[];
//     activeTab: Tabs;
//     setActiveTab: Dispatch<SetStateAction<Tabs>>;
// }

// export default function ArenaLeftPanel({ user, arenaUsers, activeTab, setActiveTab }: ArenaLeftPanelProps) {

//     const [activeChatUser, setActiveChatUser] = useState<ArenaUser | null>(null);

//     return (
//         <>
//             <ArenaSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
//             <ArenaSidePanel user={user} arenaUsers={arenaUsers} setActiveTab={setActiveTab} />
//         </>
//     )
// }
