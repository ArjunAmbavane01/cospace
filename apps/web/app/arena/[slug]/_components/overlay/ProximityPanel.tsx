import { useState, useEffect } from 'react';
import { User } from 'better-auth'
import { Socket } from 'socket.io-client';
import { ArenaUser } from '@/lib/validators/arena'
import ProximityVideoPanel from './ProximityVideoPanel'

interface ProximityPanelProps {
    adminUser: User;
    socket: Socket | null;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    handleCreateOffer: (answerUserId: string) => Promise<void>;
    handleResetCallSession: () => void;
    handleMediaToggle: (mediaType: "video" | "audio", enabled: boolean, participantId: string) => void;
}

export default function ProximityPanel({
    adminUser,
    socket,
    localStream,
    remoteStream,
    handleCreateOffer,
    handleResetCallSession,
    handleMediaToggle
}: ProximityPanelProps) {

    const [proximityUsers, setProximityUsers] = useState<ArenaUser[]>([]);
    const [currentVideoParticipant, setCurrentVideoParticipant] = useState<ArenaUser | null>(null);


    useEffect(() => {
        const handleAddProximityUser = (evt: Event) => {
            const customEvent = evt as CustomEvent;
            const { user } = customEvent.detail;
            setProximityUsers((users) => {
                if (users.some(u => u.id === user.id)) return users;
                return [...users, user];
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
    }, []);

    useEffect(() => {
        if (proximityUsers.length === 0) return;
        const userInProximity = proximityUsers[0];
        if (!userInProximity || !userInProximity.isOnline) return;
        setCurrentVideoParticipant(userInProximity);

        if (adminUser.id < userInProximity.id) {
            handleCreateOffer(userInProximity.id);
        }

    }, [proximityUsers, handleCreateOffer, adminUser.id, remoteStream]);

    useEffect(() => {
        if (remoteStream && currentVideoParticipant) {
            // Enable all tracks when remote stream is available
            remoteStream.getTracks().forEach(track => {
                track.enabled = true;
            });
        }
    }, [remoteStream, currentVideoParticipant]);

    useEffect(() => {
        if (proximityUsers.length === 0 && currentVideoParticipant) {
            if (remoteStream) {
                remoteStream.getTracks().forEach(track => {
                    track.enabled = false;
                });
            }
            handleResetCallSession();
            setCurrentVideoParticipant(null);
        }
    }, [proximityUsers, handleResetCallSession, currentVideoParticipant, remoteStream]);

    return (
        <div className='flex justify-center gap-10 absolute top-3 inset-x-0 mx-auto w-full'>
            {proximityUsers.length > 0 && currentVideoParticipant &&
                <ProximityVideoPanel
                    admin={adminUser}
                    participant={currentVideoParticipant}
                    localStream={localStream}
                    remoteStream={remoteStream}
                    socket={socket}
                    handleMediaToggle={handleMediaToggle}
                />
            }
        </div>
    )
}
