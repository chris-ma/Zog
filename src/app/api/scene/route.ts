import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { loadStory, getNodeFromStory } from '@/lib/story-loader';
import { getDynamicScene } from '@/lib/story-engine';
import type { Story, DynamicContext } from '@/types/story';

const sceneRequestSchema = z.object({
  storyId: z.string(),
  nodeId: z.string().optional(),
  sessionId: z.string().optional(),
  choicePath: z.array(z.string()).optional().default([]),
  previousProse: z.array(z.string()).optional().default([]),
  lastChoice: z.string().optional(),
});

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

    const story = loadStory(storyId);
    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    if (story.isDynamic) {
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
    }

    const targetNodeId = nodeId ?? story.rootNodeId;
    const node = getNodeFromStory(story, targetNodeId);

    if (!node) {
      return NextResponse.json(
        { error: `Node '${targetNodeId}' not found in story` },
        { status: 404 },
      );
    }

    return NextResponse.json({ scene: node, isDynamic: false });
  } catch (error) {
    console.error('[POST /api/scene]', error);
    return NextResponse.json({ error: 'Failed to load scene' }, { status: 500 });
  }
}
