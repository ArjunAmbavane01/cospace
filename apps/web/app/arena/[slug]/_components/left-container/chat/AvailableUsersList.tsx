import React, { Dispatch, SetStateAction } from 'react'
import AvailableUserItem from './AvailableUserItem'
import { ArenaUser } from '@/lib/validators/arena';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';

interface AvailableUsersListProps {
    arenaUsers: ArenaUser[];
    handleSelectGroup: (userId: string) => Promise<void>;
    isCreatingGroup: boolean;
    setOpenModal: Dispatch<SetStateAction<boolean>>;
}

export default function AvailableUsersList({ arenaUsers, handleSelectGroup, setOpenModal, isCreatingGroup }: AvailableUsersListProps) {
    return (
        <div className='flex flex-col gap-1 p-2 rounded-xl h-32 overflow-y-auto relative'>
            <div className={cn(
                "justify-center items-center absolute inset-0 bg-muted/90 pointer-events-none",
                isCreatingGroup ? "flex" : "hidden"
            )}>
                <Spinner />
            </div>
            <div className={cn(isCreatingGroup && "pointer-events-none")}>
                {arenaUsers.map(user => {
                    return <AvailableUserItem
                        key={`${user.id}-available`}
                        user={user}
                        isCreatingGroup={isCreatingGroup}
                        handleSelectGroup={handleSelectGroup}
                        setOpenModal={setOpenModal}
                    />
                })}
            </div>
        </div>
    )
}
