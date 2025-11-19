import dotenv from 'dotenv';
dotenv.config();
import { Server } from "socket.io";
import { handleAuth } from './lib/handleAuth';
import { Offer } from './types';

const offers: Offer[] = [];

try {
    const wss = new Server(Number(process.env.WEBRTC_PORT), {
        cors: {
            origin: [process.env.FRONTEND_URL!],
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    // auth middleware for connection and adds socket to room
    wss.use(handleAuth);

    wss.on("connection", async (socket) => {
        try {
            socket.on("offer", async (payload) => {
                const newOffer = {
                    offerUserId: socket.data.userId,
                    answerUserId: payload.answerUserId,
                    arenaSlug: socket.data.arenaSlug,
                    offer: payload.offer,
                    offerIceCandidates: [],
                    answer: null,
                    answerIceCandidates: [],
                }
                offers.push(newOffer);

                const onlineUserSockets = await wss.in(socket.data.arenaSlug).fetchSockets();
                const answerSocket = onlineUserSockets.find(socket => socket.data.userId === payload.answerUserId);
                if (!answerSocket) {
                    console.log("no socket available for answer");
                    return;
                }
                socket.to(answerSocket.id).emit("offerAwaiting", newOffer)
            })

            socket.on("sendIceCandidateToSignalingServer", async (payload) => {
                const { iceCandidate, iceUserId, didIOffer } = payload;
                if (didIOffer) {
                    const targetOffer = offers.find(off => off.offerUserId === iceUserId);
                    if (!targetOffer) return;
                    targetOffer.offerIceCandidates.push(iceCandidate);

                    const onlineUserSockets = await wss.in(socket.data.arenaSlug).fetchSockets();
                    const answerSocket = onlineUserSockets.find(socket => socket.data.userId === targetOffer.answerUserId);
                    if (!answerSocket) {
                        console.log("Ice candidate recieved but could not find answerer");
                        return;
                    }
                    socket.to(answerSocket.id).emit("recievedIceCandidateFromServer", iceCandidate);
                } else {
                    const targetOffer = offers.find(off => off.answerUserId === iceUserId);
                    if (!targetOffer) return;
                    const onlineUserSockets = await wss.in(socket.data.arenaSlug).fetchSockets();
                    const offerSocket = onlineUserSockets.find(socket => socket.data.userId === targetOffer.offerUserId);
                    if (!offerSocket) {
                        console.log("Ice candidate recieved but could not find offerer");
                        return;
                    }
                    socket.to(offerSocket.id).emit("recievedIceCandidateFromServer", iceCandidate);
                }
            })
        } catch (err) {
            console.error(err instanceof Error ? err.message : "Some internal error occurred");
        }
    });
} catch (err) {
    console.error("Failed to start server", err);
}