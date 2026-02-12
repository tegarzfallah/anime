import Link from 'next/link';
import { getEpisodeDetail } from '@/lib/scraper/client';
import { Player } from '@/components/watch/player';

const episodeSlugFromUrl = (url: string | null) => {
  if (!url) return null;
  return url.replace(/^https:\/\/otakudesu\.[a-zA-Z0-9-]+\/episode\//, '').replace(/\/$/, '');
};

export default async function WatchPage({ params, searchParams }: { params: { slug: string }; searchParams: { anime?: string } }) {
  const payload = await getEpisodeDetail(params.slug);
  const data = payload.data;

  const prevSlug = episodeSlugFromUrl(data.navigation.prev);
  const nextSlug = episodeSlugFromUrl(data.navigation.next);
  const animeSlug = searchParams.anime || String(data.info.anime || '');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{data.title}</h1>

      <Player
        iframe={data.iframe}
        animeSlug={animeSlug}
        animeTitle={String(data.info.title || data.title)}
        episodeSlug={params.slug}
        episodeTitle={data.title}
      />

      <div className="flex gap-3 text-sm">
        {prevSlug ? (
          <Link href={`/watch/${prevSlug}?anime=${animeSlug}`} className="rounded border border-zinc-700 px-3 py-1">
            Prev Episode
          </Link>
        ) : null}
        {nextSlug ? (
          <Link href={`/watch/${nextSlug}?anime=${animeSlug}`} className="rounded border border-zinc-700 px-3 py-1">
            Next Episode
          </Link>
        ) : null}
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Episode Selector</h2>
        <div className="grid gap-2 md:grid-cols-2">
          {data.episodes.map((ep) => (
            <Link key={ep.slug} href={`/watch/${ep.slug}?anime=${animeSlug}`} className="rounded-lg border border-zinc-800 bg-panel p-3 text-sm">
              {ep.title}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
