import React, { Dispatch, SetStateAction } from 'react'
import AvailableUserItem from './AvailableUserItem'
import { ArenaUser } from '@/lib/validators/arena';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';

interface AvailableUsersListProps {
    arenaUsers: ArenaUser[];
    searchQuery: string;
    handleSelectGroup: (userId: string) => Promise<void>;
    isCreatingGroup: boolean;
    setOpenModal: Dispatch<SetStateAction<boolean>>;
}

export default function AvailableUsersList({ arenaUsers, searchQuery, handleSelectGroup, setOpenModal, isCreatingGroup }: AvailableUsersListProps) {

    if (arenaUsers.length === 0 && searchQuery) {
        return (
            <div className="flex justify-center items-center h-40 p-5 text-muted-foreground text-center border border-dashed rounded-xl break-all whitespace-normal">
                No users match &quot;{searchQuery.slice(0, 20)}{searchQuery.length > 20 ? "…" : ""}&quot;.
            </div>
        );
    }

    if (arenaUsers.length === 0) {
        return (
            <div className="flex justify-center items-center h-40 p-5 text-muted-foreground text-center border border-dashed rounded-xl text-balance">
                <h4>
                    No users available.<br />
                    <span className="text-foreground">Invite</span> people to start chatting.
                </h4>
            </div>
        );
    }

    return (
        <div className='flex flex-col gap-1 p-2 h-40 rounded-xl border border-dashed overflow-y-auto relative'>
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
