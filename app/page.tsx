import Link from 'next/link';
import { getComplete, getHome, getOngoing } from '@/lib/scraper/client';
import { AnimeSection } from '@/components/anime/section';
import { ContinueWatching } from '@/components/anime/continue-watching';
import { ErrorState } from '@/components/ui/state';

export default async function HomePage({
  searchParams
}: {
  searchParams: { ongoingPage?: string; completePage?: string };
}) {
  const ongoingPage = String(Math.max(1, Number.parseInt(searchParams.ongoingPage || '1', 10) || 1));
  const completePage = String(Math.max(1, Number.parseInt(searchParams.completePage || '1', 10) || 1));

  const [homeResult, ongoingResult, completeResult] = await Promise.allSettled([
    getHome(),
    getOngoing(ongoingPage),
    getComplete(completePage)
  ]);

  const home = homeResult.status === 'fulfilled' ? homeResult.value : { ongoing: { count: 0, data: [] }, completed: { count: 0, data: [] } };
  const ongoing =
    ongoingResult.status === 'fulfilled'
      ? ongoingResult.value
      : { success: false, page: Number(ongoingPage), total_data: 0, pagination: { available_pages: [], next_page: null }, data: [] };
  const complete =
    completeResult.status === 'fulfilled'
      ? completeResult.value
      : { success: false, page: Number(completePage), total_data: 0, pagination: { available_pages: [], next_page: null }, data: [] };

  const hasPartialFailure =
    homeResult.status === 'rejected' || ongoingResult.status === 'rejected' || completeResult.status === 'rejected';
  const spotlight = home.ongoing.data[0] || ongoing.data[0] || complete.data[0];

  return (
    <div className="space-y-10 pb-10">
      <section className="relative overflow-hidden rounded-3xl border border-zinc-800/90 bg-panel px-6 py-8 md:px-10 md:py-12">
        <div className="absolute -right-24 -top-20 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute -left-20 -bottom-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="relative grid gap-8 md:grid-cols-[1.45fr_1fr] md:items-center">
          <div className="space-y-5">
            <p className="inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
              Animetsu inspired
            </p>
            <h1 className="text-3xl font-black leading-tight text-white md:text-5xl">
              Stream latest anime with a clean <span className="text-amber-300">Animetsu-style</span> experience
            </h1>
            <p className="max-w-2xl text-sm text-zinc-300 md:text-base">
              Watch ongoing episodes, discover completed titles, and jump back into your continue watching queue with fast search and smooth browsing.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/search" className="rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-bold text-zinc-950 transition hover:bg-amber-300">
                Explore Anime
              </Link>
              <Link href={spotlight ? `/anime/${spotlight.slug}` : '/search'} className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-900">
                {spotlight ? 'Watch Spotlight' : 'Browse Library'}
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">Now Trending</h2>
            <div className="mt-4 space-y-3">
              {home.ongoing.data.slice(0, 4).map((item, index) => (
                <Link key={item.slug} href={`/anime/${item.slug}`} className="flex items-start justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2 transition hover:border-zinc-700">
                  <div className="min-w-0">
                    <p className="line-clamp-1 text-sm font-medium text-zinc-100">
                      {index + 1}. {item.title}
                    </p>
                    <p className="text-xs text-zinc-400">{item.episode || item.episodeInfo || item.meta}</p>
                  </div>
                  <span className="rounded bg-amber-400/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-300">Hot</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ContinueWatching />

      {hasPartialFailure ? (
        <ErrorState message="Some sections are temporarily unavailable due to upstream network errors. Please refresh in a moment." />
      ) : null}

      <AnimeSection title="Trending Today" items={home.ongoing.data.slice(0, 12)} />

      <section className="space-y-4">
        <AnimeSection title={`Latest Ongoing • Page ${ongoing.page}`} items={ongoing.data.slice(0, 12)} />
        <div className="flex gap-2 text-sm">
          <Link
            href={`/?ongoingPage=${Math.max(1, ongoing.page - 1)}&completePage=${completePage}`}
            className="rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-1.5 transition hover:border-zinc-600 hover:bg-zinc-800"
          >
            Prev
          </Link>
          <Link
            href={`/?ongoingPage=${ongoing.page + 1}&completePage=${completePage}`}
            className="rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-1.5 transition hover:border-zinc-600 hover:bg-zinc-800"
          >
            Next
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <AnimeSection title={`Recommended / Completed • Page ${complete.page}`} items={complete.data.slice(0, 12)} />
        <div className="flex gap-2 text-sm">
          <Link
            href={`/?ongoingPage=${ongoingPage}&completePage=${Math.max(1, complete.page - 1)}`}
            className="rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-1.5 transition hover:border-zinc-600 hover:bg-zinc-800"
          >
            Prev
          </Link>
          <Link
            href={`/?ongoingPage=${ongoingPage}&completePage=${complete.page + 1}`}
            className="rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-1.5 transition hover:border-zinc-600 hover:bg-zinc-800"
          >
            Next
          </Link>
        </div>
      </section>

      <div className="flex gap-4">
        <Link href="/search" className="rounded-lg border border-zinc-700 bg-zinc-900/70 px-4 py-2 text-sm font-medium transition hover:border-zinc-500 hover:bg-zinc-800">
          Search Anime
        </Link>
      </div>
    </div>
  );
}
