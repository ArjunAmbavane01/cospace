import { Dispatch, SetStateAction } from "react";
import { io, Socket } from "socket.io-client";
import { OfferData, TypeOfCall } from "../validators/rtc";

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