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

  return (
    <div className="space-y-10">
      <ContinueWatching />

      {hasPartialFailure ? (
        <ErrorState message="Some sections are temporarily unavailable due to upstream network errors. Please refresh in a moment." />
      ) : null}

      <AnimeSection title="Trending (Home Ongoing)" items={home.ongoing.data.slice(0, 12)} />

      <section className="space-y-4">
        <AnimeSection title={`Latest Ongoing • Page ${ongoing.page}`} items={ongoing.data.slice(0, 12)} />
        <div className="flex gap-2 text-sm">
          <Link href={`/?ongoingPage=${Math.max(1, ongoing.page - 1)}&completePage=${completePage}`} className="rounded border border-zinc-700 px-3 py-1">
            Prev
          </Link>
          <Link href={`/?ongoingPage=${ongoing.page + 1}&completePage=${completePage}`} className="rounded border border-zinc-700 px-3 py-1">
            Next
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <AnimeSection title={`Recommended / Completed • Page ${complete.page}`} items={complete.data.slice(0, 12)} />
        <div className="flex gap-2 text-sm">
          <Link href={`/?ongoingPage=${ongoingPage}&completePage=${Math.max(1, complete.page - 1)}`} className="rounded border border-zinc-700 px-3 py-1">
            Prev
          </Link>
          <Link href={`/?ongoingPage=${ongoingPage}&completePage=${complete.page + 1}`} className="rounded border border-zinc-700 px-3 py-1">
            Next
          </Link>
        </div>
      </section>

      <div className="flex gap-4">
        <Link href="/search" className="rounded-lg border border-zinc-700 px-4 py-2 text-sm">
          Search Anime
        </Link>
      </div>
    </div>
  );
}
