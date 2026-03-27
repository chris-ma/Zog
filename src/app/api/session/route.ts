import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

const createSessionSchema = z.object({
  storyId: z.string(),
  sessionId: z.string().optional(),
});

/**
 * POST /api/session
 * Creates a new player session or resumes an existing one.
 *
 * Body:
 *   storyId   — required; the story to start/resume
 *   sessionId — optional; if provided, resumes the existing session
 */
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

    // Optionally associate the session with a logged-in user
    const authSession = await getServerSession(authOptions);
    const userId = (authSession?.user as { id?: string } | undefined)?.id ?? null;

    // Resume existing session
    if (sessionId) {
      const existing = await db.playerSession.findUnique({
        where: { id: sessionId },
      });

      if (existing) {
        return NextResponse.json({ session: existing });
      }
    }

    // Fetch story to get the root node ID
    const story = await db.story.findUnique({
      where: { id: storyId },
      select: { rootNodeId: true },
    });

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    // Create a new player session
    const newSession = await db.playerSession.create({
      data: {
        storyId,
        userId,
        currentNodeId: story.rootNodeId,
        choicePath: [],
        completed: false,
      },
    });

    return NextResponse.json({ session: newSession }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/session]', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
