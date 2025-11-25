import { safeParse } from 'zod';
import { authHeaderSchema } from '../validators/auth';
import { db } from "@repo/db/client";
import { ExtendedError, Socket } from 'socket.io';

export const handleAuth = async (socket: Socket, next: (err?: ExtendedError) => void) => {
    const authHeader = socket.handshake.auth;
    try {
        const parseResult = safeParse(authHeaderSchema, authHeader);
        if (!parseResult.success) {
            console.error("Auth validation failed:", parseResult.error.message);
            return next(new Error("Invalid authentication data"));
        }
        const { userToken, arenaSlug } = parseResult.data;

        const user = await db.query.session.findFirst({
            where: (session, { eq }) => eq(session.token, userToken),
            with: {
                user: {
                    columns: {
                        id: true,
                        name: true,
                        image: true,
                    }
                }
            }
        })
        if (!user) next(new Error("Valid session not found"));
        else {
            socket.data.arenaSlug = arenaSlug;
            socket.data.userId = user.user.id;
            socket.data.userName = user.user.name;
            socket.data.userImage = user.user.image;
            socket.join(arenaSlug);
            next();
        }
    } catch (err) {
        console.error(err instanceof Error ? err.message : "Something went wrong");
        return next(new Error("Authentication failed"));
    }
}