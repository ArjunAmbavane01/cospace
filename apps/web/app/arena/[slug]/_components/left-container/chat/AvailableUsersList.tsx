import React, { Dispatch, SetStateAction } from 'react'
import AvailableUserItem from './AvailableUserItem'
import { ArenaUser } from '@/lib/validators/arena';
import { Spinner } from '@/components/ui/spinner';

interface AvailableUsersListProps {
    arenaUsers: ArenaUser[];
    setGroupId: (userId: string) => void;
    isCreatingGroup: boolean;
    setOpenModal: Dispatch<SetStateAction<boolean>>;
    setActiveChatUser: Dispatch<SetStateAction<ArenaUser | null>>;
}

export default function AvailableUsersList({ arenaUsers, setGroupId, setOpenModal, setActiveChatUser, isCreatingGroup }: AvailableUsersListProps) {
    return (
        <div className='flex flex-col gap-1 p-2 rounded-xl h-32 overflow-y-auto'>
            {isCreatingGroup && (
                <div className='flex justify-center items-center inset-0 bg-foreground/20 pointer-events-none'>
                    <Spinner />
                </div>
            )}
            {arenaUsers.map(user => {
                return <AvailableUserItem
                    key={user.id}
                    user={user}
                    setGroupId={setGroupId}
                    setOpenModal={setOpenModal}
                    setActiveChatUser={setActiveChatUser}
                />
            })}
        </div>
    )
}
