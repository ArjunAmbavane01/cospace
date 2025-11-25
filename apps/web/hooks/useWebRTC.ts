import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { io, Socket } from "socket.io-client";
import { Session, User } from 'better-auth';
import { CallSession, TypeOfCall } from '@/lib/validators/rtc';
import { peerConfiguration } from '@/lib/rtc/config';

interface UseWebRTCResult {
    webrtcSocket: Socket | null;
    setWebrtcSocket: Dispatch<SetStateAction<Socket | null>>;
    typeOfCall: TypeOfCall;
    setTypeOfCall: Dispatch<SetStateAction<TypeOfCall>>;
    isUserMediaReady: boolean;
    setIsUserMediaReady: Dispatch<SetStateAction<boolean>>;
    localStream: MediaStream | null;
    setLocalStream: Dispatch<SetStateAction<MediaStream | null>>;
    remoteStream: MediaStream | null;
    setRemoteStream: Dispatch<SetStateAction<MediaStream | null>>
    peerConnection: RTCPeerConnection | null;
    setPeerConnection: Dispatch<SetStateAction<RTCPeerConnection | null>>;
    callSession: CallSession | null;
    setCallSession: Dispatch<SetStateAction<CallSession | null>>;
    handleCreateOffer: (answerUserId: string) => Promise<void>;
    handleResetCallSession: () => void;
}

export const useWebRTC = (userSession: { user: User; session: Session }, slug: string): UseWebRTCResult => {

    const [webrtcSocket, setWebrtcSocket] = useState<Socket | null>(null);
    const [typeOfCall, setTypeOfCall] = useState<TypeOfCall>(undefined);
    const [isUserMediaReady, setIsUserMediaReady] = useState<boolean>(false);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
    const [callSession, setCallSession] = useState<CallSession | null>(null);
    const [pendingIce, setPendingIce] = useState<RTCIceCandidateInit[]>([]);


    const handleCreateOffer = useCallback((answererUserId: string): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!webrtcSocket || !peerConnection || !webrtcSocket.connected) {
                    console.error("Socket or PeerConnection not connected.");
                    return;
                }
                setTypeOfCall("offer");
                const offer = await peerConnection.createOffer();;
                peerConnection.setLocalDescription(offer);
                const payload = {
                    offer,
                    slug,
                    answererUserId
                }
                webrtcSocket.emit("offer", payload);
                console.log("offer sent")
                console.log("offer created");
                resolve();
            } catch (err) {
                reject(err);
            }
        })
    }, [webrtcSocket, peerConnection, slug]);

    const handleResetCallSession = useCallback(() => {
        // disable tracks from remote stream
        if (remoteStream) {
            remoteStream.getTracks().forEach(track => {
                track.enabled = false;
            });
        }
        setCallSession(null);
        setTypeOfCall(undefined);
    }, []);

    // socket listeners 
    const handleIncomingOffer = useCallback(async (newOffer: CallSession) => {

        try {
            if (!webrtcSocket || !peerConnection || !newOffer?.offer) return;

            setTypeOfCall("answer");
            await peerConnection.setRemoteDescription(newOffer.offer);
            for (const ice of pendingIce) {
                try {
                    await peerConnection.addIceCandidate(ice);
                } catch (err) {
                    console.error("Error adding buffered ICE:", err);
                }
            }
            setPendingIce([]);

            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            const newCallSession = { ...newOffer };
            newCallSession.answer = answer;

            setCallSession(newCallSession);
            const offererIceCandidates = await webrtcSocket.emitWithAck("answer", newCallSession);
            console.log("answer sent")
            offererIceCandidates.forEach(async (iceC: RTCIceCandidateInit) => {
                try {
                    if (peerConnection.remoteDescription) await peerConnection.addIceCandidate(iceC)
                } catch (err) {
                    console.log("Error adding offererIceCandidates ", err)
                }
            })
        } catch (err) {
            console.error('Error handling incoming offer : ', err);
        }
    }, [webrtcSocket, peerConnection, callSession, pendingIce]);

    const handleIncomingAnswer = useCallback(async (answerAckObj: CallSession) => {
        try {
            if (!peerConnection || !answerAckObj.answer) return;
            console.log("answer received")
            await peerConnection.setRemoteDescription(answerAckObj.answer)
        } catch (err) {
            console.error('Error handling answer ack : ', err);
        }
    }, [peerConnection]);

    const handleIncomingIceCandidates = useCallback(async (iceC: RTCIceCandidateInit) => {
        if (!iceC) return;

        if (!peerConnection?.remoteDescription) {
            setPendingIce(prev => [...prev, iceC]);
            return;
        }

        try {
            if (!peerConnection?.remoteDescription) return;
            await peerConnection.addIceCandidate(iceC);
        } catch (err) {
            console.error('Error handling incoming ICE candidate:', err);
        }
    }, [peerConnection]);

    // init connection to signalling server
    useEffect(() => {

        if (!isUserMediaReady || webrtcSocket) return;

        try {
            const socket = io(`${process.env.NEXT_PUBLIC_WEBRTC_BACKEND_URL}`, {
                auth: {
                    userToken: userSession.session.token,
                    arenaSlug: slug,
                },
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionAttempts: 3,
            });
            if (!socket) return;
            setWebrtcSocket(socket);
        } catch (err) {
            console.error(err instanceof Error ? err.message : "Something went wrong while connecting to signalling server")
        }
    }, [slug, userSession.session.token, isUserMediaReady, webrtcSocket]);

    useEffect(() => {
        if (!webrtcSocket) return;

        webrtcSocket.off("incomingOffer");
        webrtcSocket.off("answerAck");
        webrtcSocket.off("incomingIceCandidates");

        webrtcSocket.on("incomingOffer", handleIncomingOffer);
        webrtcSocket.on("answerAck", handleIncomingAnswer);
        webrtcSocket.on("incomingIceCandidates", handleIncomingIceCandidates);
    }, [webrtcSocket, handleIncomingOffer, handleIncomingAnswer, handleIncomingIceCandidates]);

    // once we have socket and userMedia, create PeerConnection
    useEffect(() => {
        const createPeerConnection = async () => {

            if (!webrtcSocket || !localStream || !isUserMediaReady || peerConnection) return;

            try {

                const createdPeerConnection = new RTCPeerConnection(peerConfiguration);
                const createdRemoteStream = new MediaStream();

                createdPeerConnection.addEventListener("icecandidate", (e) => {
                    if (e.candidate) {
                        webrtcSocket.emit("sendIceCToServer", {
                            iceCandidate: e.candidate,
                            iceUserId: userSession.user.id,
                            didIOffer: typeOfCall === "offer"
                        })
                    }
                });

                createdPeerConnection.addEventListener("track", (e) => {
                    if (!e.streams[0]) return;
                    e.streams[0].getTracks().forEach(track => {
                        createdRemoteStream.addTrack(track);
                    });

                    // set Updated stream with recieved tracks
                    setRemoteStream(prevStream => {
                        if (!prevStream) return prevStream;
                        return new MediaStream(prevStream.getTracks());
                    });
                });

                createdPeerConnection.addEventListener("track", (e) => {
                    if (!e.streams[0]) return;
                    e.streams[0].getTracks().forEach(track => createdRemoteStream.addTrack(track))
                });

                setPeerConnection(createdPeerConnection);
                setRemoteStream(createdRemoteStream);
                localStream.getTracks().forEach(track => {
                    createdPeerConnection.addTrack(track, localStream);
                });
                console.log("PC created and tracks added")
            } catch (err) {
                console.error(err instanceof Error ? err.message : "Something went wrong while creating peerConnection");
            }
        }

        createPeerConnection();
    }, [webrtcSocket, localStream, peerConnection, isUserMediaReady, typeOfCall]);

    return {
        webrtcSocket,
        setWebrtcSocket,
        typeOfCall,
        setTypeOfCall,
        isUserMediaReady,
        setIsUserMediaReady,
        localStream,
        setLocalStream,
        remoteStream,
        setRemoteStream,
        peerConnection,
        setPeerConnection,
        callSession,
        setCallSession,
        handleCreateOffer,
        handleResetCallSession,
    }
}