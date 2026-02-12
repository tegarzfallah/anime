import { NextResponse } from 'next/server';
import { getHome } from '@/lib/scraper/client';

export async function GET() {
  try {
    return NextResponse.json(await getHome());
  } catch (error) {
    return NextResponse.json({ message: 'Failed to load home feed', error: (error as Error).message }, { status: 500 });
  }
}
