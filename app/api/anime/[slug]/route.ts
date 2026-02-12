import { NextResponse } from 'next/server';
import { getAnimeDetail } from '@/lib/scraper/client';

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  try {
    const safeSlug = params.slug.replace(/[^a-zA-Z0-9-]/g, '');
    return NextResponse.json(await getAnimeDetail(safeSlug));
  } catch (error) {
    return NextResponse.json({ message: 'Failed to load anime details', error: (error as Error).message }, { status: 500 });
  }
}
