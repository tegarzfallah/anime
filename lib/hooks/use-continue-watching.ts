'use client';

import { useEffect, useState } from 'react';

export type ContinueWatchingItem = {
  animeSlug: string;
  animeTitle: string;
  episodeSlug: string;
  episodeTitle: string;
  at: number;
};

const KEY = 'continue-watching';

export const useContinueWatching = () => {
  const [items, setItems] = useState<ContinueWatchingItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      setItems(JSON.parse(raw));
    } catch {
      setItems([]);
    }
  }, []);

  const save = (item: ContinueWatchingItem) => {
    setItems((prev) => {
      const merged = [item, ...prev.filter((x) => x.episodeSlug !== item.episodeSlug)].slice(0, 20);
      localStorage.setItem(KEY, JSON.stringify(merged));
      return merged;
    });
  };

  return { items, save };
};
