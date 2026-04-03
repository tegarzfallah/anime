import Image from 'next/image';
import Link from 'next/link';
import type { AnimeCard } from '@/lib/types/anime';

export const AnimeCardItem = ({ anime }: { anime: AnimeCard }) => (
  <Link
    href={`/anime/${anime.slug}`}
    className="group overflow-hidden rounded-xl border border-zinc-800/90 bg-panel shadow-[0_16px_50px_-30px_rgba(0,0,0,0.95)] transition hover:-translate-y-1 hover:border-amber-300/40"
  >
    <div className="relative aspect-[3/4] w-full overflow-hidden">
      <Image src={anime.thumbnail} alt={anime.title} fill className="object-cover transition duration-300 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-60 transition group-hover:opacity-80" />
    </div>
    <div className="space-y-1.5 p-3">
      <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-zinc-100">{anime.title}</h3>
      <p className="text-xs text-amber-300/90">{anime.episode || anime.episodeInfo || anime.meta}</p>
    </div>
  </Link>
);
