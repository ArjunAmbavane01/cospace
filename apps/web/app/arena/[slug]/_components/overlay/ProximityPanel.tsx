import { useEffect, useState } from 'react'
import { ArenaUser } from '@/lib/validators/game'
import { User } from 'better-auth'
import ProximityCard from '../ProximityCard'

interface ProximityPanelProps {
    adminUser: User
}

export default function ProximityPanel({ adminUser }: ProximityPanelProps) {
    const [proximityUsers, setProximityUsers] = useState<ArenaUser[]>([]);

    useEffect(() => {
        const handleAddProximityUser = (evt: Event) => {
            const customEvent = evt as CustomEvent;
            const { user } = customEvent.detail;
            console.log(user)
            setProximityUsers((users) => {
                if (users.some(u => u.userId === user.userId)) return users;
                return [...users, user]
            });
        }

        const handleDeleteProximityUser = (evt: Event) => {
            const customEvent = evt as CustomEvent;
            const data = customEvent.detail;
            setProximityUsers((proxyUsers) => proxyUsers.filter(u => u.userId !== data.userId));
        }

        window.addEventListener('user-proximity', handleAddProximityUser);
        window.addEventListener('user-left-proximity', handleDeleteProximityUser);
        return () => {
            window.removeEventListener('user-proximity', handleAddProximityUser);
            window.removeEventListener('user-left-proximity', handleDeleteProximityUser);
        }
    }, [])
    return (
        <div className='flex justify-center gap-10 absolute top-5 inset-x-0 mx-auto w-full opacity-95'>
            {proximityUsers.length > 0 &&
                <div className='flex gap-2 w-fit p-1 pb-5 rounded-xl bg-[#3f323e] border border-muted'>
                    <ProximityCard id={adminUser.id} name={adminUser.name} image={adminUser.image} />
                    {proximityUsers.map((user) => <ProximityCard key={user.userId} id={user.userId} name={user.userName} image={user.userImage} />)}
                </div>
            }
        </div>
    )
}
