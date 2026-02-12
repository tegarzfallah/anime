'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { SearchResult } from '@/lib/types/anime';
import { EmptyState, ErrorState } from '@/components/ui/state';
import { Skeleton } from '@/components/ui/skeleton';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('all');
  const [status, setStatus] = useState('all');
  const [year, setYear] = useState('all');
  const [data, setData] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const doSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
      if (!res.ok) throw new Error('Search failed');
      const json = await res.json();
      setData(json.data || []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const genres = useMemo(() => ['all', ...new Set(data.flatMap((i) => i.genres))], [data]);
  const statuses = useMemo(() => ['all', ...new Set(data.map((i) => i.status).filter(Boolean))], [data]);

  const filtered = data.filter((item) => {
    const matchesGenre = genre === 'all' || item.genres.includes(genre);
    const matchesStatus = status === 'all' || item.status === status;
    const itemYear = item.year || 'Unknown';
    const matchesYear = year === 'all' || itemYear === year;
    return matchesGenre && matchesStatus && matchesYear;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Search & Filters</h1>
      <div className="grid gap-3 rounded-xl border border-zinc-800 bg-panel p-4 md:grid-cols-5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value.replace(/[<>]/g, ''))}
          placeholder="Search anime..."
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 md:col-span-2"
        />
        <select value={genre} onChange={(e) => setGenre(e.target.value)} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2">
          {genres.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2">
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select value={year} onChange={(e) => setYear(e.target.value)} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2">
          {['all', 'Unknown'].map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
        <button onClick={doSearch} className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black">
          Search
        </button>
      </div>

      {error && <ErrorState message={error} />}
      {loading && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4]" />
          ))}
        </div>
      )}
      {!loading && filtered.length === 0 && <EmptyState message="No anime found. Try another keyword or filter." />}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {filtered.map((item) => (
          <Link key={item.slug} href={`/anime/${item.slug}`} className="overflow-hidden rounded-xl border border-zinc-800 bg-panel">
            <div className="relative aspect-[3/4]">
              <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
            </div>
            <div className="p-3">
              <p className="line-clamp-2 text-sm font-medium">{item.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
