'use client';

import { useEffect } from 'react';
import { useContinueWatching } from '@/lib/hooks/use-continue-watching';

export const Player = ({
  iframe,
  animeSlug,
  animeTitle,
  episodeSlug,
  episodeTitle
}: {
  iframe: string | null;
  animeSlug: string;
  animeTitle: string;
  episodeSlug: string;
  episodeTitle: string;
}) => {
  const { save } = useContinueWatching();

  useEffect(() => {
    save({ animeSlug, animeTitle, episodeSlug, episodeTitle, at: Date.now() });
  }, [animeSlug, animeTitle, episodeSlug, episodeTitle]);

  if (!iframe) {
    return <p className="rounded-lg border border-zinc-800 p-4 text-zinc-400">No stream embed found for this episode.</p>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800">
      <iframe src={iframe} className="aspect-video w-full" allowFullScreen />
    </div>
  );
};
