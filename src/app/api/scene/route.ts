import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getStaticNode, getDynamicScene } from '@/lib/story-engine';
import type { Story, StoryNode, DynamicContext } from '@/types/story';

const sceneRequestSchema = z.object({
  storyId: z.string(),
  nodeId: z.string().optional(),
  sessionId: z.string().optional(),
  choicePath: z.array(z.string()).optional().default([]),
  previousProse: z.array(z.string()).optional().default([]),
  lastChoice: z.string().optional(),
});

/**
 * POST /api/scene
 * Handles both static and dynamic scene requests.
 *
 * For static stories: looks up the node by ID in the database.
 * For dynamic stories: calls Claude to generate the next scene.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = sceneRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { storyId, nodeId, choicePath, previousProse, lastChoice } = parsed.data;

    // Fetch the story from the database
    const story = await db.story.findUnique({
      where: { id: storyId },
      include: { nodes: true },
    });

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    const typedStory = story as unknown as Story & { nodes: StoryNode[] };

    if (story.isDynamic) {
      // Dynamic story: generate a scene with Claude
      const context: DynamicContext = {
        storyId,
        story: {
          title: story.title,
          description: story.description,
          genre: story.genre as Story['genre'],
          artStyle: story.artStyle,
          mood: story.mood,
        },
        choicePath: choicePath ?? [],
        previousProse: previousProse ?? [],
        lastChoice,
        nodeDepth: (choicePath ?? []).length,
      };

      const scene = await getDynamicScene(context);
      return NextResponse.json({ scene, isDynamic: true });
    } else {
      // Static story: look up node by ID
      const targetNodeId = nodeId ?? story.rootNodeId;
      const node = getStaticNode(typedStory, targetNodeId);

      if (!node) {
        return NextResponse.json(
          { error: `Node '${targetNodeId}' not found in story` },
          { status: 404 },
        );
      }

      return NextResponse.json({ scene: node, isDynamic: false });
    }
  } catch (error) {
    console.error('[POST /api/scene]', error);
    return NextResponse.json({ error: 'Failed to load scene' }, { status: 500 });
  }
}
