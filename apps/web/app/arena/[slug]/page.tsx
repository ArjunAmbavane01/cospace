import { validateArenaSlug } from 'server/actions/arena';
import ArenaClientWrapper from './_components/ArenaClientWrapper';
import ArenaNotFound from './_components/ArenaNotFound';

export default async function ArenaPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const isSlugValid = await validateArenaSlug(slug);

    if (isSlugValid.type === "error") return <ArenaNotFound />
    return <ArenaClientWrapper slug={slug} />
}