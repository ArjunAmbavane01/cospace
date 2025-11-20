import { useState, useEffect, Dispatch, SetStateAction, useCallback } from 'react';
import { User } from 'better-auth'
import { Socket } from 'socket.io-client'
import { OfferData, TypeOfCall } from '@/lib/validators/rtc'
import { ArenaUser } from '@/lib/validators/arena'
import ProximityVideoPanel from './ProximityVideoPanel'

interface ProximityPanelProps {
    adminUser: User;
    webrtcSocket: Socket | null;
    localStream: MediaStream | null;
    setLocalStream: Dispatch<SetStateAction<MediaStream | null>>;
    remoteStream: MediaStream | null;
    setRemoteStream: Dispatch<SetStateAction<MediaStream | null>>
    peerConnection: RTCPeerConnection | null;
    setPeerConnection: Dispatch<SetStateAction<RTCPeerConnection | null>>;
    offerData: OfferData | null;
    setOfferData: Dispatch<SetStateAction<OfferData | null>>;
    handleCreatePeerConnection: () => Promise<RTCPeerConnection | undefined>;
    handleCreateOffer: (peerConnection: RTCPeerConnection, answerUserId: string) => Promise<void>;
    setTypeOfCall: Dispatch<SetStateAction<TypeOfCall>>;
}

export default function ProximityPanel({
    adminUser,
    webrtcSocket,
    localStream,
    setLocalStream,
    remoteStream,
    setRemoteStream,
    peerConnection,
    setPeerConnection,
    setOfferData,
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

        for (const iceC of offerIceCandidates) {
            try {
                if (peerConnection.remoteDescription) {
                    await peerConnection.addIceCandidate(iceC);
                }
            } catch (err) {
                console.error('Error adding ICE candidate:', err);
            }
        }
    }

    useEffect(() => {

        if (proximityUsers.length === 0 || peerConnection) return;

        let mounted = true;
        let cleanupFns: (() => void)[] = [];

        const handleRTCConnection = async () => {
            const userInProximity = proximityUsers[0];
            if (!userInProximity || !mounted) return;
            setCurrentVideoParticipant(userInProximity);
            const createdPeerConnection = await handleCreatePeerConnection();

            if (!webrtcSocket || !createdPeerConnection || !localStream || !mounted) return;

            // socket listeners 
            const answerHandler = async (offerObj: OfferData) => {
                try {
                    if (offerObj.answer) await createdPeerConnection.setRemoteDescription(offerObj.answer);
                } catch (err) {
                    console.error('Error setting remote description:', err);
                }
            };

            const iceCandidateHandler = async (iceC: RTCIceCandidateInit) => {
                if (!iceC) return;
                try {
                    if (createdPeerConnection.remoteDescription) {
                        await createdPeerConnection.addIceCandidate(iceC);
                    }
                } catch (err) {
                    console.error('Error adding ICE candidate:', err);
                }
            };

            const offerHandler = async (offerData: OfferData) => {
                if (!offerData || !mounted) return;
                try {
                    setOfferData(offerData);
                    setTypeOfCall("answer");
                    await handleIncomingOffer(createdPeerConnection, offerData);
                } catch (err) {
                    console.error('Error handling incoming offer:', err);
                }
            };

            webrtcSocket.on("answerResponse", answerHandler);
            webrtcSocket.on("recievedIceCandidateFromServer", iceCandidateHandler);
            webrtcSocket.on("offerAwaiting", offerHandler);

            cleanupFns.push(() => {
                webrtcSocket.off("answerResponse", answerHandler);
                webrtcSocket.off("recievedIceCandidateFromServer", iceCandidateHandler);
                webrtcSocket.off("offerAwaiting", offerHandler);
            });

            localStream.getTracks().forEach(track => {
                createdPeerConnection.addTrack(track, localStream);
            })
            if (adminUser.id < userInProximity.id) await initiateWebRTCOffer(userInProximity, createdPeerConnection);
        }
        handleRTCConnection();

        return () => {
            mounted = false;
            cleanupFns.forEach(fn => fn());
        }
    }, [proximityUsers, webrtcSocket, localStream, peerConnection]);

    useEffect(() => {
        if (proximityUsers.length === 0 && peerConnection) {
            peerConnection.close();
            peerConnection.onicecandidate = null;
            peerConnection.ontrack = null;
            setPeerConnection(null);
            setRemoteStream(null);
            setOfferData(null);
            setCurrentVideoParticipant(null);
        }
    }, [proximityUsers.length, peerConnection]);

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
