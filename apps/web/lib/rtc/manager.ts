import { Socket } from "socket.io-client";
import { peerConfiguration } from "./config";
import { TypeOfCall } from "../validators/rtc";

const createPeerConnection = (socket: Socket, userId: string, typeOfCall: TypeOfCall) => {
    try {
        const peerConnection = new RTCPeerConnection(peerConfiguration);
        const remoteStream = new MediaStream();

        peerConnection.addEventListener("signalingstatechange", () => {
            console.log("Signaling evt change");
            console.log(peerConnection.signalingState)
        });

        peerConnection.addEventListener("icecandidate", (e) => {
            if (e.candidate) {
                socket.emit("sendIceCandidateToSignalingServer", {
                    iceCandidate: e.candidate,
                    iceUserId: userId,
                    didIOffer: typeOfCall === "offer"
                })
            }
        });

        peerConnection.addEventListener("track", (e) => {
            if (!e.streams[0]) return;
            e.streams[0].getTracks().forEach(track => {
                remoteStream.addTrack(track)
            })
        });

        return {
            peerConnection,
            remoteStream
        }

    } catch (err) {
        console.error(err instanceof Error ? err.message : "Something went wrong while creating peerConnection");
    }
}

const createOffer = async (socket: Socket, peerConnection: RTCPeerConnection, arenaSlug: string, answerUserId: string) => {
    const offer = await peerConnection.createOffer();
    peerConnection.setLocalDescription(offer);
    const payload = {
        offer,
        arenaSlug,
        answerUserId
    }
    socket.emit("offer", payload);
}

export const rtcManager = {
    createPeerConnection,
    createOffer,
}