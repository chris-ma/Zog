import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { loadStory } from '@/lib/story-loader';

const createSessionSchema = z.object({
  storyId: z.string(),
  sessionId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createSessionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { storyId, sessionId } = parsed.data;

    const story = loadStory(storyId);
    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    const session = {
      id: sessionId ?? `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      userId: null,
      storyId,
      currentNodeId: story.rootNodeId,
      choicePath: [],
      started: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      completed: false,
    };

    return NextResponse.json({ session }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/session]', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
