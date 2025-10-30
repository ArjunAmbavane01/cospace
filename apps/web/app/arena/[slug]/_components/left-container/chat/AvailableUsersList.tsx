import React, { Dispatch, SetStateAction } from 'react'
import AvailableUserItem from './AvailableUserItem'
import { ArenaUser } from '@/lib/validators/game';

interface AvailableUsersListProps {
    arenaUsers: ArenaUser[];
    setGroupId: (userId: string) => void;
    setOpenModal:Dispatch<SetStateAction<boolean>>
}

export default function AvailableUsersList({ arenaUsers, setGroupId,setOpenModal }: AvailableUsersListProps) {
    return (
        <div className='flex flex-col gap-1 p-2 rounded-xl h-32 overflow-y-auto'>
            {arenaUsers.map(user => {
                return <AvailableUserItem key={user.userId} user={user} setGroupId={setGroupId} setOpenModal={setOpenModal} />
            })}
        </div>
    )
}
