import { Dispatch, SetStateAction } from "react";
import { io, Socket } from "socket.io-client";
import { CallStatus, OfferData, TypeOfCall } from "../validators/rtc";

export const connectToSignallingServer = (
    userToken: string,
    arenaSlug: string,
): Socket | undefined => {
    try {
        const ws = io(`${process.env.NEXT_PUBLIC_WEBRTC_BACKEND_URL}`, {
            auth: {
                userToken,
                arenaSlug,
            },
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 3,
        });
        return ws;
    } catch (err) {
        console.error(err instanceof Error ? err.message : "Something went wrong while connecting to signalling server")
    }
}

export const addWebrtcSocketListeners = (
    webrtcSocket: Socket,
    peerConnection: RTCPeerConnection,
    setCallStatus: Dispatch<SetStateAction<CallStatus>>,
    setOfferData: Dispatch<SetStateAction<OfferData | null>>,
    setTypeOfCall: Dispatch<SetStateAction<TypeOfCall>>,
    handleIncomingOffer: (peerConnection: RTCPeerConnection, offerData: OfferData) => Promise<void>,
) => {
    webrtcSocket.on("answerResponse", offerObj => {
        setCallStatus(c => ({ ...c, answer: offerObj.answer }));
        peerConnection.setRemoteDescription(offerObj.answer);
    })

    webrtcSocket.on("recievedIceCandidateFromServer", async iceC => {
        if (!iceC) return;
        try {
            if (peerConnection.remoteDescription) {
                await peerConnection.addIceCandidate(iceC)
            }
        } catch (err) {
            console.error(err instanceof Error ? err.message : "Something went wrong while adding ice candidate from server")
        }
    })

    webrtcSocket.on("offerAwaiting", async (offerData: OfferData) => {
        if (!offerData) return;
        try {
            setOfferData(offerData);
            setTypeOfCall("answer");
            await handleIncomingOffer(peerConnection, offerData);
        } catch (err) {
            console.error(err instanceof Error ? err.message : "Something went wrong while receiving offer")
        }
    })
}