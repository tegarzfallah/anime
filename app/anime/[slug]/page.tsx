import Image from 'next/image';
import Link from 'next/link';
import { getAnimeDetail } from '@/lib/scraper/client';

export default async function AnimeDetailPage({ params }: { params: { slug: string } }) {
  const detail = await getAnimeDetail(params.slug);
  const data = detail.data;

  return (
    <div className="space-y-8">
      <section className="grid gap-6 md:grid-cols-[260px_1fr]">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-zinc-800">
          <Image src={data.thumbnail} alt={data.title} fill className="object-cover" />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold">{data.title}</h1>
          <p className="text-sm text-zinc-400">{data.streaming_title}</p>
          <p className="whitespace-pre-line text-sm leading-7 text-zinc-300">{data.synopsis || 'No synopsis available.'}</p>
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(data.info.genres) ? data.info.genres : []).map((genre) => (
              <span key={genre} className="rounded-full border border-zinc-700 px-3 py-1 text-xs">
                {genre}
              </span>
            ))}
          </div>
          <p className="text-sm text-zinc-300">Rating: {(data.info.rating as string) || 'N/A'}</p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Episode List</h2>
        <div className="grid gap-2 md:grid-cols-2">
          {data.episodes.map((ep) => (
            <Link key={ep.slug} href={`/watch/${ep.slug}?anime=${params.slug}`} className="rounded-lg border border-zinc-800 bg-panel p-3 text-sm">
              {ep.title}
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Recommended</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {data.rekomendasi.map((rec) => (
            <Link key={rec.slug} href={`/anime/${rec.slug}`} className="text-sm text-zinc-300">
              <div className="relative mb-2 aspect-[3/4] overflow-hidden rounded-xl border border-zinc-800">
                <Image src={rec.thumbnail} alt={rec.title} fill className="object-cover" />
              </div>
              <p className="line-clamp-2">{rec.title}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
