import Image from 'next/image';
import Link from 'next/link';
import type { AnimeCard } from '@/lib/types/anime';

export const AnimeCardItem = ({ anime }: { anime: AnimeCard }) => (
  <Link href={`/anime/${anime.slug}`} className="group overflow-hidden rounded-xl border border-zinc-800 bg-panel">
    <div className="relative aspect-[3/4] w-full overflow-hidden">
      <Image src={anime.thumbnail} alt={anime.title} fill className="object-cover transition duration-300 group-hover:scale-105" />
    </div>
    <div className="space-y-1 p-3">
      <h3 className="line-clamp-2 text-sm font-semibold text-zinc-100">{anime.title}</h3>
      <p className="text-xs text-zinc-400">{anime.episode || anime.episodeInfo || anime.meta}</p>
    </div>
  </Link>
);
