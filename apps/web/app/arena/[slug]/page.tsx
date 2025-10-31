import { getArenaUsers, validateArenaSlug } from 'server/actions/arena';
import ArenaLayoutWrapper from './_components/ArenaLayoutWrapper';
import ArenaNotFound from './_components/ArenaNotFound';
import { toast } from 'sonner';

export default async function ArenaPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const isSlugValid = await validateArenaSlug(slug);
    if (isSlugValid.type === "error") return <ArenaNotFound />

    const res = await getArenaUsers(slug);
    if (res.type === "error") {
        toast.error(res.message)
        return <div>Failed to initialize the arena</div>;
    }
    return <ArenaLayoutWrapper slug={slug} arenaUsers={res.arenaUsers} />
}