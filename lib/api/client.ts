import type {
  AnimeDetailPayload,
  EpisodeDetailPayload,
  HomePayload,
  PaginationPayload,
  AnimeCard,
  SearchPayload
} from '@/lib/types/anime';

const request = async <T>(path: string): Promise<T> => {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
};

export const apiClient = {
  home: () => request<HomePayload>('/api/home'),
  ongoing: (page: number) => request<PaginationPayload<AnimeCard>>(`/api/ongoing?page=${page}`),
  complete: (page: number) => request<PaginationPayload<AnimeCard>>(`/api/complete?page=${page}`),
  search: (query: string) => request<SearchPayload>(`/api/search?q=${encodeURIComponent(query)}`),
  anime: (slug: string) => request<AnimeDetailPayload>(`/api/anime/${slug}`),
  episode: (slug: string) => request<EpisodeDetailPayload>(`/api/episode/${slug}`)
};
