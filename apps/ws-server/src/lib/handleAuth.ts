import { safeParse } from 'zod';
import { authHeaderSchema } from '../validators/auth';
import { db } from "@repo/db/client";
import { ExtendedError, Socket } from 'socket.io';

export const handleAuth = async (socket: Socket, next: (err?: ExtendedError) => void) => {
    const authHeader = socket.handshake.auth;
    try {
        const { error, data } = safeParse(authHeaderSchema, authHeader);
        if (error) throw new Error(error.message);
        const { userToken, arenaSlug } = data;

        const user = await db.query.session.findFirst({
            where: (session, { eq }) => eq(session.token, userToken),
            with: {
                user: true
            }
        })
        if (!user) next(new Error("Valid session not found"));
        else {
            socket.data.arenaSlug = arenaSlug;
            socket.data.userId = user.userId;
            socket.data.userName = user.user.name;
            socket.join(arenaSlug);
            next();
        }
    } catch (err) {
        console.error(err instanceof Error ? err.message : "Auth validation failed");
    }
}