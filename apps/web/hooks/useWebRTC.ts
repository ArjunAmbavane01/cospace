import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { Socket } from "socket.io-client";
import { Session, User } from 'better-auth';
import { connectToSignallingServer } from '@/lib/rtc/signalling';
import { CallStatus, OfferData, TypeOfCall } from '@/lib/validators/rtc';
import { rtcManager } from '@/lib/rtc/manager';

interface UseWebRTCResult {
    webrtcSocket: Socket | null;
    remoteStream: MediaStream | null;
    localStream: MediaStream | null;
    setLocalStream: Dispatch<SetStateAction<MediaStream | null>>;
    isUserMediaReady: boolean;
    setIsUserMediaReady: Dispatch<SetStateAction<boolean>>;
    callStatus: CallStatus;
    setCallStatus: Dispatch<SetStateAction<CallStatus>>;
    offerData: OfferData | null;
    setOfferData: Dispatch<SetStateAction<OfferData | null>>;
    peerConnection: RTCPeerConnection | null;
    setTypeOfCall: Dispatch<SetStateAction<TypeOfCall>>;
    handleCreateOffer: (peerConnection: RTCPeerConnection, answerUserId: string) => Promise<void>;
    handleCreatePeerConnection: () => Promise<RTCPeerConnection | undefined>;
}

export const useWebRTC = (userSession: { user: User; session: Session }, slug: string): UseWebRTCResult => {

    const [webrtcSocket, setWebrtcSocket] = useState<Socket | null>(null);
    const [isWebrtcSocketConnecting, setIsWebrtcSocketConnecting] = useState<boolean>(false);
    const [typeOfCall, setTypeOfCall] = useState<TypeOfCall>("offer");
    const [isUserMediaReady, setIsUserMediaReady] = useState<boolean>(false);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
    const [offerData, setOfferData] = useState<OfferData | null>(null);
    const [callStatus, setCallStatus] = useState<CallStatus>({
        haveMedia: false,
        audioEnabled: false,
        videoEnabled: false,
        answer: null,
        myRole: typeOfCall
    });

    const handleCreatePeerConnection = useCallback((): Promise<RTCPeerConnection | undefined> => {
        return new Promise((resolve, reject) => {
            try {
                if (webrtcSocket && callStatus.haveMedia && !peerConnection) {
                    const res = rtcManager.createPeerConnection(webrtcSocket, userSession.user.id, typeOfCall)
                    if (!res) return;
                    const { peerConnection, remoteStream } = res;
                    setPeerConnection(peerConnection);
                    setRemoteStream(remoteStream);
                    resolve(peerConnection);
                } else {
                    resolve(undefined)
                }
            } catch (err) {
                reject(err);
            }
        })
    }, [callStatus.haveMedia, webrtcSocket, peerConnection, typeOfCall, userSession.user.id]);

    const handleCreateOffer = useCallback((peerConnection: RTCPeerConnection, answerUserId: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            try {
                if (!webrtcSocket || !peerConnection) return;
                rtcManager.createOffer(webrtcSocket, peerConnection, slug, answerUserId);
                resolve();
            } catch (err) {
                reject(err);
            }
        })
    }, [webrtcSocket, peerConnection]);

    // init connection to signalling server
    useEffect(() => {

        setIsWebrtcSocketConnecting(true);

        if (webrtcSocket) return; // already connected
        if (!isUserMediaReady) return;
        try {
            const ws = connectToSignallingServer(userSession.session.token, slug);
            if (ws) setWebrtcSocket(ws);
        } catch (err) {
            setWebrtcSocket(null);
            setIsWebrtcSocketConnecting(false);
            console.error(err instanceof Error ? err.message : err)
        }
        return () => {
            setIsWebrtcSocketConnecting(false);
            setWebrtcSocket(null);
        }
    }, [slug, userSession?.session?.token, isUserMediaReady]);

    return {
        webrtcSocket,
        remoteStream,
        localStream,
        setLocalStream,
        isUserMediaReady,
        setIsUserMediaReady,
        callStatus,
        setCallStatus,
        offerData,
        setOfferData,
        peerConnection,
        setTypeOfCall,
        handleCreateOffer,
        handleCreatePeerConnection
    }
}