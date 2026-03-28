import { NextResponse } from 'next/server';
import { listStories } from '@/lib/story-loader';

export async function GET() {
  try {
    const stories = listStories();
    return NextResponse.json({ stories });
  } catch (error) {
    console.error('[GET /api/story]', error);
    return NextResponse.json({ error: 'Failed to load stories' }, { status: 500 });
  }
}
