import { NextResponse } from 'next/server';
// TODO: Import db and fetch stories from the database
// import { db } from '@/lib/db';

/**
 * GET /api/story
 * Returns the story library.
 * TODO: Replace stub with real DB query once the database is seeded.
 */
export async function GET() {
  try {
    // TODO: Replace with actual database query
    // const stories = await db.story.findMany({
    //   select: {
    //     id: true,
    //     slug: true,
    //     title: true,
    //     description: true,
    //     genre: true,
    //     artStyle: true,
    //     mood: true,
    //     estimatedMinutes: true,
    //     coverImageUrl: true,
    //     rootNodeId: true,
    //     isDynamic: true,
    //     theme: true,
    //     createdAt: true,
    //   },
    // });

    const stories: unknown[] = [];

    return NextResponse.json({ stories });
  } catch (error) {
    console.error('[GET /api/story]', error);
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 });
  }
}
