import { NextRequest, NextResponse } from 'next/server';
import { getComplete } from '@/lib/scraper/client';

export async function GET(request: NextRequest) {
  try {
    const page = request.nextUrl.searchParams.get('page') || '1';
    const safePage = String(Math.max(1, Number.parseInt(page, 10) || 1));
    return NextResponse.json(await getComplete(safePage));
  } catch (error) {
    return NextResponse.json({ message: 'Failed to load complete list', error: (error as Error).message }, { status: 500 });
  }
}
