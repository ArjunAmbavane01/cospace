import dotenv from 'dotenv';
dotenv.config();
import { Server } from "socket.io";
import { handleAuth } from './lib/handleAuth';

const parseMessage = (message: string) => {
    try {
        return JSON.parse(message);
    } catch (err) {
        console.error("Error parsing the message");
        throw new Error("Error parsing the message");
    }
}

try {
    const wss = new Server(Number(process.env.WS_PORT), {
        cors: {
            origin: ["http://localhost:3000"],
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    // auth middleware for connection and adds socket to room
    wss.use(handleAuth);

    wss.on("connection", async (socket) => {
        try {
            socket.emit("welcome", `Welcome to CoSpace! ${socket.data.userName}`);
            const roomUsers = await wss.in(socket.data.arenaSlug).fetchSockets();

            const roomUsersData = roomUsers.filter(roomUser => roomUser.id !== socket.id).map(roomUser => {
                return {
                    userId: roomUser.data.userId,
                    userName: roomUser.data.userName,
                    userImage: roomUser.data.userImage,
                    lastOnline: "online"
                }
            })

            socket.emit("room-users", {
                roomUsers: roomUsersData
            })

            socket.to(socket.data.arenaSlug).emit("user-joined", {
                userId: socket.data.userId,
                userName: socket.data.userName,
                userImage: socket.data.userImage
            })

            socket.on("player-pos", (data) => {
                socket.to(socket.data.arenaSlug).emit("player-pos", data);
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
} catch (err) {
    console.error("Failed to start server", err);
}