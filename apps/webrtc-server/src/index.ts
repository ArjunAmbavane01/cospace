import dotenv from 'dotenv';
dotenv.config();
import { Server } from "socket.io";
import { handleAuth } from './lib/handleAuth';
import { CallSession } from './types';

const offers: CallSession[] = [];

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
                console.log(`📤 Offer received from ${socket.data.userId} for ${payload.answererUserId}`);
                const newOffer = {
                    offererUserId: socket.data.userId,
                    answererUserId: payload.answererUserId,
                    arenaSlug: socket.data.arenaSlug,
                    offer: payload.offer,
                    offererIceCandidates: [],
                    answer: null,
                    answererIceCandidates: [],
                }
                offers.push(newOffer);

                const availableSockets = await wss.in(socket.data.arenaSlug).fetchSockets();
                const answerSocket = availableSockets.find(socket => socket.data.userId === payload.answererUserId);
                if (!answerSocket) {
                    console.log("no socket available for answer");
                    return;
                }
                console.log(`✅ Forwarding offer to ${answerSocket.data.userId}`);
                socket.to(answerSocket.id).emit("incomingOffer", newOffer)
            })

            socket.on("sendIceCToServer", async (payload) => {
                const { iceCandidate, iceUserId, didIOffer } = payload;
                if (didIOffer) {
                    const targetOffer = offers.find(off => off.offererUserId === iceUserId);
                    if (!targetOffer) return;
                    targetOffer.offererIceCandidates.push(iceCandidate);

                    const availableSockets = await wss.in(socket.data.arenaSlug).fetchSockets();
                    const answerSocket = availableSockets.find(socket => socket.data.userId === targetOffer.answererUserId);
                    if (!answerSocket) {
                        console.log("Ice candidate recieved but could not find answerer");
                        return;
                    }
                    socket.to(answerSocket.id).emit("incomingIceCandidates", iceCandidate);
                } else {
                    const targetOffer = offers.find(off => off.answererUserId === iceUserId);
                    if (!targetOffer) return;
                    targetOffer.answererIceCandidates.push(iceCandidate);
                    const availableSockets = await wss.in(socket.data.arenaSlug).fetchSockets();
                    const offerSocket = availableSockets.find(socket => socket.data.userId === targetOffer.offererUserId);
                    if (!offerSocket) {
                        console.log("Ice candidate recieved but could not find offerer");
                        return;
                    }
                    socket.to(offerSocket.id).emit("incomingIceCandidates", iceCandidate);
                }
            })

            socket.on("answer", async (answerData, ackFunction) => {
                console.log(`📥 Answer received from ${socket.data.userId} for offer from ${answerData.offererUserId}`);
                const availableSockets = await wss.in(socket.data.arenaSlug).fetchSockets();
                const offererSocket = availableSockets.find(socket => socket.data.userId === answerData.offererUserId);
                if (!offererSocket) {
                    console.log("no socket available to send answer");
                    return;
                }
                const offerToUpdate = offers.find(o => o.offererUserId === answerData.offererUserId);
                if (!offerToUpdate) {
                    console.log("No OfferToUpdate")
                    return;
                }
                ackFunction(offerToUpdate.offererIceCandidates);
                offerToUpdate.answer = answerData.answer;
                console.log(`✅ Forwarding answer to ${offererSocket.data.userId}`);
                socket.to(offererSocket.id).emit("answerAck", offerToUpdate);
            })

            socket.on("disconnect", () => {
                // Clean up offers for this user
                const userOffers = offers.filter(o =>
                    o.offererUserId === socket.data.userId || o.answererUserId === socket.data.userId
                );
                userOffers.forEach(offer => {
                    const index = offers.indexOf(offer);
                    if (index > -1) offers.splice(index, 1);
                });
            });
        } catch (err) {
            console.error(err instanceof Error ? err.message : "Some internal error occurred");
        }
    });

} catch (err) {
    console.error("Failed to start server", err);
}