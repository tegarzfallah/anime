# AniStream (Next.js + TypeScript + Tailwind)

A modern, responsive anime streaming web app with a lightweight backend scraper layer.

## Stack
- **Next.js 14 (App Router)** for SSR + API routes
- **TypeScript** for typed models and safer API integration
- **Tailwind CSS** for fast, modern dark-mode UI
- **Cheerio** in server routes to parse the source pages from `api.txt`

## Features
- Home page with:
  - Trending (from `/` ongoing group)
  - Latest ongoing (from `/ongoing-anime/page/:page`)
  - Completed/recommended section (from `/complete-anime/page/:page`)
- Search page with filters (genre, status, year-if-available)
- Anime detail page with synopsis, genres, rating, episodes, recommendations
- Watch page with embedded player, episode selector, prev/next episode navigation
- Continue Watching persisted in `localStorage`
- Loading skeletons, empty states, and error states
- Pagination controls for ongoing/completed lists

## API contract used (from `api.txt`)
The app only uses these source endpoints:
- `/`
- `/ongoing-anime/page/:page`
- `/complete-anime/page/:page`
- `/?s=:query&post_type=anime`
- `/anime/:slug`
- `/episode/:slug`

## Environment
Create `.env.local` (optional):

```bash
ANIME_SOURCE_URL=https://otakudesu.cloud
ANIME_FETCH_RETRIES=3
ANIME_FETCH_TIMEOUT_MS=12000
```

If not provided, it defaults to the value above.

## Setup
```bash
npm install
npm run dev
```
Open `http://localhost:3000`.

## Build
```bash
npm run build
npm run start
```

## Assumptions from `api.txt`
- `home` sections map to ongoing/completed groupings extracted from `/`.
- Search API does not provide canonical year; filter is shown and applied when year exists in data.
- Episode detail supports playable iframe via the episode page embed; mirror/deep resolver in example code is partially omitted in `api.txt`, so direct iframe extraction is used.
