import type { AnimeCard } from '@/lib/types/anime';
import { AnimeCardItem } from '@/components/anime/anime-card';

export const AnimeSection = ({ title, items }: { title: string; items: AnimeCard[] }) => (
  <section className="space-y-4">
    <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
      {items.map((anime) => (
        <AnimeCardItem anime={anime} key={anime.slug} />
      ))}
    </div>
  </section>
);
