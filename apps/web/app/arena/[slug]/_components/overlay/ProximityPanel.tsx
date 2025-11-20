import { useState, useEffect, Dispatch, SetStateAction, useCallback } from 'react';
import { User } from 'better-auth'
import { Socket } from 'socket.io-client'
import { CallStatus, OfferData, TypeOfCall } from '@/lib/validators/rtc'
import { addWebrtcSocketListeners } from '@/lib/rtc/signalling';
import { ArenaUser } from '@/lib/validators/arena'
import ProximityVideoPanel from './ProximityVideoPanel'

interface ProximityPanelProps {
    adminUser: User;
    webrtcSocket: Socket | null;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    peerConnection: RTCPeerConnection | null;
    offerData: OfferData | null;
    setOfferData: Dispatch<SetStateAction<OfferData | null>>;
    setCallStatus: Dispatch<SetStateAction<CallStatus>>;
    handleCreatePeerConnection: () => Promise<RTCPeerConnection | undefined>;
    handleCreateOffer: (peerConnection: RTCPeerConnection, answerUserId: string) => Promise<void>;
    setTypeOfCall: Dispatch<SetStateAction<TypeOfCall>>;
}

export default function ProximityPanel({
    adminUser,
    webrtcSocket,
    localStream,
    remoteStream,
    peerConnection,
    offerData,
    setOfferData,
    setCallStatus,
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

    const initiateWebRTCOffer = async (userInProximity: ArenaUser, createdPeerConnection: RTCPeerConnection) => {
        setTypeOfCall("offer");
        await handleCreateOffer(createdPeerConnection, userInProximity.id);
    }

    const handleIncomingOffer = async (peerConnection: RTCPeerConnection, offerData: OfferData) => {
        if (!webrtcSocket || !peerConnection || !offerData || !offerData.offer) return;
        
        await peerConnection.setRemoteDescription(offerData.offer);
        console.log(peerConnection.signalingState);
        
        const answer = await peerConnection.createAnswer();
        peerConnection.setLocalDescription(answer);
        
        const copyOfferData = { ...offerData };
        copyOfferData.answer = answer;
        
        const offerIceCandidates = await webrtcSocket.emitWithAck("newAnswer", copyOfferData);
        
        offerIceCandidates.forEach((iceC: RTCIceCandidateInit) => {
            peerConnection.addIceCandidate(iceC);
        });
    }

    useEffect(() => {

        const handleRTCConnection = async () => {

            if (proximityUsers.length === 0) return;
            const userInProximity = proximityUsers[0];
            if (!userInProximity) return;
            setCurrentVideoParticipant(userInProximity);

            const createdPeerConnection = await handleCreatePeerConnection();

            if (!webrtcSocket || !createdPeerConnection || !localStream ) return;

            addWebrtcSocketListeners(webrtcSocket, createdPeerConnection, setCallStatus, setOfferData, setTypeOfCall, handleIncomingOffer);
            localStream.getTracks().forEach(track => {
                createdPeerConnection.addTrack(track, localStream);
            })
            if (adminUser.id < userInProximity.id) initiateWebRTCOffer(userInProximity, createdPeerConnection);
        }
        handleRTCConnection();
    }, [proximityUsers, webrtcSocket, localStream]);

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
