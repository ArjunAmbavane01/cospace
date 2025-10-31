import { useEffect, useState } from 'react'
import { ArenaUser } from '@/lib/validators/arena'
import { User } from 'better-auth'
import ProximityCard from './ProximityCard'

interface ProximityPanelProps {
    adminUser: User
}

export default function ProximityPanel({ adminUser }: ProximityPanelProps) {
    const [proximityUsers, setProximityUsers] = useState<ArenaUser[]>([]);

    useEffect(() => {
        const handleAddProximityUser = (evt: Event) => {
            const customEvent = evt as CustomEvent;
            const { user } = customEvent.detail;
            setProximityUsers((users) => {
                if (users.some(u => u.id === user.id)) return users;
                return [...users, user]
            });
        }

        const handleDeleteProximityUser = (evt: Event) => {
            const customEvent = evt as CustomEvent;
            const { userId } = customEvent.detail;
            setProximityUsers((proxyUsers) => proxyUsers.filter(u => u.id !== userId));
        }

        window.addEventListener('user-proximity', handleAddProximityUser);
        window.addEventListener('user-left-proximity', handleDeleteProximityUser);
        return () => {
            window.removeEventListener('user-proximity', handleAddProximityUser);
            window.removeEventListener('user-left-proximity', handleDeleteProximityUser);
        }
    }, [])
    return (
        <div className='flex justify-center gap-10 absolute top-3 inset-x-0 mx-auto w-full opacity-95'>
            {proximityUsers.length > 0 &&
                <div className='flex gap-2 w-fit p-1 pb-5 rounded-xl bg-[#3f323e] border border-muted'>
                    <ProximityCard key={`${adminUser.id}-proximity`} name={adminUser.name} image={adminUser.image} />
                    {proximityUsers.map((user) => <ProximityCard key={`${user.id}-proximity`} name={user.name} image={user.image} />)}
                </div>
            }
        </div>
    )
}
