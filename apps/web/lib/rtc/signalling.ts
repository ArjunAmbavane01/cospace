import { Dispatch, SetStateAction } from "react";
import { io, Socket } from "socket.io-client";
import { CallStatus } from "../validators/rtc";

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
    setCallStatus: Dispatch<SetStateAction<CallStatus>>
) => {
    webrtcSocket.on("answerResponse", offerObj => {
        console.log(offerObj);
        setCallStatus(c => ({ ...c, answer: offerObj.answer }))
    })

    webrtcSocket.on("recievedIceCandidateFromServer", async (iceC) => {
        if (!iceC) return;
        try {
            console.log(iceC)
            await peerConnection.addIceCandidate(iceC)
        } catch (err) {
            console.error(err instanceof Error ? err.message : "Something went wrong while adding ice candidate from server")
        }
    })
}