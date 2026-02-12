import { NextResponse } from 'next/server';
import { getEpisodeDetail } from '@/lib/scraper/client';

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  try {
    const safeSlug = params.slug.replace(/[^a-zA-Z0-9-]/g, '');
    return NextResponse.json(await getEpisodeDetail(safeSlug));
  } catch (error) {
    return NextResponse.json({ message: 'Failed to load episode details', error: (error as Error).message }, { status: 500 });
  }
}
