export type AnimeCard = {
  title: string;
  slug: string;
  thumbnail: string;
  link: string;
  episode?: string;
  day?: string;
  date?: string;
  meta?: string;
  episodeInfo?: string;
  type?: 'ongoing' | 'completed';
};

export type PaginationPayload<T> = {
  success: boolean;
  page: number;
  total_data: number;
  pagination: {
    available_pages: number[];
    next_page: string | null;
  };
  data: T[];
};

export type HomePayload = {
  ongoing: {
    count: number;
    data: AnimeCard[];
  };
  completed: {
    count: number;
    data: AnimeCard[];
  };
};

export type SearchResult = {
  title: string;
  link: string;
  slug: string;
  thumbnail: string;
  genres: string[];
  status: string;
  rating: string;
  year?: string;
};

export type SearchPayload = {
  success: boolean;
  total_data: number;
  data: SearchResult[];
};

export type Episode = {
  title: string;
  link: string;
  slug: string;
  release_date: string;
};

export type AnimeDetailPayload = {
  success: boolean;
  data: {
    title: string;
    streaming_title: string;
    thumbnail: string;
    synopsis: string;
    info: Record<string, string | string[]>;
    episodes: Episode[];
    rekomendasi: Array<{
      title: string;
      link: string;
      slug: string;
      thumbnail: string;
    }>;
  };
};

export type EpisodeDetailPayload = {
  success: boolean;
  data: {
    title: string;
    metadata: {
      author: string;
      release: string;
    };
    info: Record<string, string | string[] | null>;
    iframe: string | null;
    navigation: {
      prev: string | null;
      next: string | null;
    };
    episodes: Episode[];
    mirrors: Array<{
      quality: string;
      provider: string;
      token: string;
      url?: string | null;
    }>;
    downloads: Array<{
      quality: string;
      size?: string;
      providers: Array<{
        provider: string;
        url: string;
      }>;
    }>;
  };
};
