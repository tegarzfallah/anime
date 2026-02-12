'use client';

import Link from 'next/link';
import { useContinueWatching } from '@/lib/hooks/use-continue-watching';

export const ContinueWatching = () => {
  const { items } = useContinueWatching();

  if (!items.length) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">Continue Watching</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {items.slice(0, 4).map((item) => (
          <Link
            key={item.episodeSlug}
            href={`/watch/${item.episodeSlug}?anime=${item.animeSlug}`}
            className="rounded-xl border border-zinc-800 bg-panel p-4"
          >
            <p className="text-sm font-medium text-zinc-100">{item.animeTitle}</p>
            <p className="text-xs text-zinc-400">{item.episodeTitle}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};
