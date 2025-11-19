import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { User } from 'better-auth'
import { Socket } from 'socket.io-client'
import { ArenaUser } from '@/lib/validators/arena'
import { TypeOfCall } from '@/lib/validators/rtc'
import ProximityVideoPanel from './ProximityVideoPanel'

interface ProximityPanelProps {
    adminUser: User;
    webrtcSocket: Socket | null;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    handleCreatePeerConnection: () => Promise<RTCPeerConnection | undefined>;
    handleCreateOffer: (peerConnection: RTCPeerConnection, answerUserId: string) => Promise<void>;
    setTypeOfCall: Dispatch<SetStateAction<TypeOfCall>>;
}

export default function ProximityPanel({
    adminUser,
    webrtcSocket,
    localStream,
    remoteStream,
    handleCreatePeerConnection,
    handleCreateOffer,
    setTypeOfCall
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

        const handleRtcConnection = async () => {
            if (proximityUsers.length === 0 || !webrtcSocket) return;
            const userInProximity = proximityUsers[0];
            if (!userInProximity) return;
            setCurrentVideoParticipant(userInProximity);
            if (adminUser.id < userInProximity.id) {
                // start peer connection with userInProximity
                //create offer
                setTypeOfCall("offer");
                const createdPeerConnection = await handleCreatePeerConnection();
                if (!createdPeerConnection || !localStream) return;
                localStream.getTracks().forEach(track => {
                    createdPeerConnection.addTrack(track, localStream);
                })
                await handleCreateOffer(createdPeerConnection, userInProximity.id);
            }
        }
        handleRtcConnection();

    }, [proximityUsers, webrtcSocket, localStream,]);

    return (
        <div className='flex justify-center gap-10 absolute top-3 inset-x-0 mx-auto w-full opacity-95'>
            {proximityUsers.length > 0 && currentVideoParticipant &&
                <ProximityVideoPanel
                    adminName={adminUser.name}
                    adminImage={adminUser.image}
                    participantName={currentVideoParticipant.name}
                    participantImage={currentVideoParticipant.image}
                    localStream={localStream}
                    remoteStream={remoteStream}
                />
            }
        </div>
    )
}
