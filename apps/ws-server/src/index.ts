import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { ClientToServerEvents } from "@repo/schemas/arena-ws-events";
import { ServerToClientEvents } from "@repo/schemas/ws-arena-events";
import { handleAuth } from './lib/handleAuth';

try {
    const app = express();
    app.get("/health", (_, res) => res.send("WS server ok"));

    const server = createServer(app);

    const wss = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
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
            socket.emit("welcome", `Welcome to CoSpace! ${socket.data.userName}`);
            const onlineUserSockets = await wss.in(socket.data.arenaSlug).fetchSockets();

            const onlineUsers = onlineUserSockets.filter(roomUser => roomUser.id !== socket.id).map(roomUser => {
                return { userId: roomUser.data.userId }
            })

            socket.to(socket.data.arenaSlug).emit("online-users", {
                onlineUserIds: onlineUsers.map(u => u.userId)
            })

            socket.to(socket.data.arenaSlug).emit("user-joined", {
                userId: socket.data.userId,
                userName: socket.data.userName,
                userImage: socket.data.userImage
            })

            socket.on("player-pos", (data) => {
                socket.to(socket.data.arenaSlug).emit("player-pos", data);
            })

            socket.on("chat-groups", (data) => {
                const { chatGroupIds } = data;
                chatGroupIds.forEach(groupId => socket.join(groupId));
            })

            socket.on("chat-message", (data) => {
                const { groupPublicId } = data;
                socket.to(groupPublicId).emit("chat-message", data);
            })

            socket.on("media-toggle", async (data) => {
                socket.to(socket.data.arenaSlug).emit("media-toggle", data);
            })

            socket.on("disconnect", () => {
                socket.to(socket.data.arenaSlug).emit("user-left", {
                    userId: socket.data.userId,
                });
            })

        } catch (err) {
            console.error(err instanceof Error ? err.message : "Some internal error occurred");
        }
    });

    server.listen(process.env.PORT, () => {
        console.log(`Listening on PORT ${process.env.PORT}`);
    });
} catch (err) {
    console.error("Failed to start server", err);
}