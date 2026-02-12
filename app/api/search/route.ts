import { NextRequest, NextResponse } from 'next/server';
import { getSearch } from '@/lib/scraper/client';

export async function GET(request: NextRequest) {
  try {
    const q = (request.nextUrl.searchParams.get('q') || '').trim();
    if (!q) {
      return NextResponse.json({ success: true, total_data: 0, data: [] });
    }
    return NextResponse.json(await getSearch(q.slice(0, 100)));
  } catch (error) {
    return NextResponse.json({ message: 'Failed to search anime', error: (error as Error).message }, { status: 500 });
  }
}
