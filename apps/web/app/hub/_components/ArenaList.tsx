import { db } from "@repo/db/client";
import ArenaCard from "./ArenaCard";
import { Arena } from "@/lib/validators/arena";

interface ArenaListProps {
    userId: string;
}

export default async function ArenaList({ userId }: ArenaListProps) {
    const userArenas = await db.query.usersToArenas.findMany({
        where: (uta, { eq }) => eq(uta.userId, userId),
        with: {
            arena: {
                with: {
                    usersToArenas: {
                        with: {
                            user: true
                        }
                    }
                }
            },
        }
    })
    const arenasWithUsers = userArenas.map(uta => {
        const arena = uta.arena;
        const users = arena.usersToArenas.map(uta => uta.user);
        const adminUser = users.find(user => user.id === arena.adminId);
        return {
            arena,
            adminUser,
            usersCount: users.length
        }
    })
    const arenas = userArenas.map(ua => ua.arena);
    return (
        <div className="flex flex-col gap-5 w-full max-w-7xl mx-auto">
            <div className="flex gap-20 items-center">
                <h3>Your Arenas</h3>
            </div>
            <div className="grid grid-cols-4 gap-10">
                {arenasWithUsers.map((arenaWithUsers, idx) => {
                    return <ArenaCard arenaWithUsers={arenaWithUsers} key={idx} />
                })}
            </div>
        </div>
    )
}
