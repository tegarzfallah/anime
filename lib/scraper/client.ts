import { load } from 'cheerio';
import type {
  AnimeCard,
  AnimeDetailPayload,
  EpisodeDetailPayload,
  HomePayload,
  PaginationPayload,
  SearchPayload,
  SearchResult
} from '@/lib/types/anime';

const BASE_URL = process.env.ANIME_SOURCE_URL || 'https://otakudesu.cloud';

const fetchUtils = async (path: string): Promise<string> => {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36'
    },
    next: { revalidate: 300 }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.text();
};

const animeSlugFromUrl = (url: string): string =>
  url.replace(/^https:\/\/otakudesu\.[a-zA-Z0-9-]+\/anime\//, '').replace(/\/$/, '');

const episodeSlugFromUrl = (url: string): string =>
  url.replace(/^https:\/\/otakudesu\.[a-zA-Z0-9-]+\/episode\//, '').replace(/\/$/, '');

export const getHome = async (): Promise<HomePayload> => {
  const html = await fetchUtils('/');
  const $ = load(html);

  const ongoing: AnimeCard[] = [];
  const completed: AnimeCard[] = [];

  $('.venz ul li .detpost').each((_, el) => {
    const epText = $(el).find('.epz').text().trim();
    const meta = $(el).find('.epztipe').text().trim();
    const date = $(el).find('.newnime').text().trim();
    const title = $(el).find('.jdlflm').text().trim();
    const thumbnail = $(el).find('img').attr('src') ?? '';
    const link = $(el).find('.thumb a').attr('href') ?? '';
    const slug = animeSlugFromUrl(link);

    if (!title) return;

    const item: AnimeCard = {
      title,
      slug,
      episodeInfo: epText,
      meta,
      date,
      link,
      thumbnail
    };

    if (epText.toLowerCase().startsWith('episode')) {
      ongoing.push({ ...item, type: 'ongoing' });
    } else if (epText.toLowerCase().endsWith('episode')) {
      completed.push({ ...item, type: 'completed' });
    }
  });

  return {
    ongoing: { count: ongoing.length, data: ongoing },
    completed: { count: completed.length, data: completed }
  };
};

const mapPaginated = async (path: string): Promise<PaginationPayload<AnimeCard>> => {
  const html = await fetchUtils(path);
  const $ = load(html);
  const results: AnimeCard[] = [];

  $('.venz ul li .detpost').each((_, el) => {
    const title = $(el).find('.jdlflm').text().trim();
    const episode = $(el).find('.epz').text().trim();
    const day = $(el).find('.epztipe').text().trim();
    const date = $(el).find('.newnime').text().trim();
    const thumbnail = $(el).find('img').attr('src') ?? '';
    const link = $(el).find('.thumb a').attr('href') ?? '';
    const slug = animeSlugFromUrl(link);

    if (!title) return;

    results.push({ title, slug, link, episode, day, date, thumbnail });
  });

  const pages: number[] = [];
  $('.pagination .page-numbers').each((_, el) => {
    const num = Number($(el).text());
    if (!Number.isNaN(num)) pages.push(num);
  });

  return {
    success: true,
    page: Number($('.page-numbers.current').text()) || 1,
    total_data: results.length,
    pagination: {
      available_pages: pages,
      next_page: $('.next.page-numbers').attr('href') ?? null
    },
    data: results
  };
};

export const getOngoing = async (page: string) => mapPaginated(`/ongoing-anime/page/${page}`);
export const getComplete = async (page: string) => mapPaginated(`/complete-anime/page/${page}`);

export const getSearch = async (query: string): Promise<SearchPayload> => {
  const html = await fetchUtils(`/?s=${encodeURIComponent(query)}&post_type=anime`);
  const $ = load(html);
  const results: SearchResult[] = [];

  $('.chivsrc li').each((_, el) => {
    const thumbnail = $(el).find('img').attr('src') || '';
    const title = $(el).find('h2 a').text().trim();
    const link = $(el).find('h2 a').attr('href') || '';
    const slug = animeSlugFromUrl(link);

    const genres: string[] = [];
    $(el)
      .find('.set')
      .first()
      .find('a')
      .each((__, g) => {
        genres.push($(g).text().trim());
      });

    const status = $(el).find('.set').eq(1).text().replace('Status', '').replace(':', '').trim();
    const rating = $(el).find('.set').eq(2).text().replace('Rating', '').replace(':', '').trim();

    results.push({ title, link, slug, thumbnail, genres, status, rating });
  });

  return { success: true, total_data: results.length, data: results };
};

export const getAnimeDetail = async (slug: string): Promise<AnimeDetailPayload> => {
  const html = await fetchUtils(`/anime/${slug}`);
  const $ = load(html);

  const title = $('.jdlrx h1').clone().children().remove().end().text().trim();
  const streaming_title = $('.subheading h2').text().trim();
  const thumbnail = $('.fotoanime img').first().attr('src') ?? '';
  const synopsis = $('.sinopc p')
    .map((_, el) => $(el).text().trim())
    .get()
    .join('\n');

  const info: Record<string, string | string[]> = {};

  $('.infozingle p').each((_, el) => {
    const label = $(el).find('b').text().replace(':', '').trim();
    const value = $(el).text().replace(label, '').replace(':', '').trim();

    if (label === 'Genre') {
      info.genres = $(el)
        .find('a')
        .map((__, g) => $(g).text().trim())
        .get();
    } else {
      info[label.toLowerCase().replace(/\s/g, '_')] = value;
    }
  });

  const episodes = $('.episodelist')
    .eq(1)
    .find('ul li')
    .map((_, el) => {
      const link = $(el).find('a').attr('href') ?? '';
      return {
        title: $(el).find('a').text().trim(),
        link,
        slug: episodeSlugFromUrl(link),
        release_date: $(el).find('.zeebr').text().trim()
      };
    })
    .get();

  const rekomendasi = $('.isi-recommend-anime-series .isi-konten')
    .map((_, el) => {
      const anchor = $(el).find('.isi-anime a').first();
      const link = anchor.attr('href') ?? '';
      return {
        title: $(el).find('.judul-anime a').text().trim(),
        link,
        slug: animeSlugFromUrl(link),
        thumbnail: $(el).find('img').attr('src') ?? ''
      };
    })
    .get();

  return {
    success: true,
    data: { title, streaming_title, thumbnail, synopsis, info, episodes, rekomendasi }
  };
};

export const getEpisodeDetail = async (slug: string): Promise<EpisodeDetailPayload> => {
  const html = await fetchUtils(`/episode/${slug}`);
  const $ = load(html);

  const iframe = $('.player-embed iframe').attr('src') ?? $('.responsive-embed-stream iframe').attr('src') ?? null;

  const episodes = $('.episodelist ul li')
    .map((_, el) => {
      const link = $(el).find('a').attr('href') ?? '';
      return {
        title: $(el).find('a').text().trim(),
        link,
        slug: episodeSlugFromUrl(link),
        release_date: $(el).find('.zeebr').text().trim()
      };
    })
    .get();

  const info: Record<string, string | string[] | null> = {
    thumbnail: $('.cukder img').attr('src') ?? null
  };

  $('.infozingle p').each((_, el) => {
    const label = $(el).find('b').text().replace(':', '').trim();
    const value = $(el).text().replace(label, '').replace(':', '').trim();
    if (!label) return;
    if (label === 'Genre') {
      info.genres = $(el)
        .find('a')
        .map((__, g) => $(g).text().trim())
        .get();
    } else {
      info[label.toLowerCase().replace(/\s/g, '_')] = value;
    }
  });

  const navigation = {
    prev: $('.flir a').attr('href') ?? null,
    next: $('.fler a').attr('href') ?? null
  };

  return {
    success: true,
    data: {
      title: $('.posttl').text().trim(),
      metadata: {
        author: $('.kategoz span').first().text().replace('Posted by', '').trim(),
        release: $('.kategoz span').eq(1).text().replace('Release on', '').trim()
      },
      info,
      iframe,
      navigation,
      episodes,
      mirrors: [],
      downloads: []
    }
  };
};
