import { NextRequest, NextResponse } from 'next/server';
import { getCachedImage } from '@/lib/redis';
import { getOrGenerateImage } from '@/lib/image-cache';

interface ImageRouteParams {
  params: Promise<{ scene_id: string }>;
}

/**
 * GET /api/image/:scene_id
 * Polls image generation status for a given scene.
 *
 * Query params:
 *   storyId     — required
 *   nodeId      — required
 *   choicePath  — JSON-encoded string array (optional)
 *   prompt      — image prompt (required to trigger generation)
 *
 * Response:
 *   { status: 'ready', url: string }
 *   { status: 'generating' }
 *   { status: 'error', error: string }
 */
export async function GET(request: NextRequest, { params }: ImageRouteParams) {
  try {
    const { scene_id } = await params;
    const { searchParams } = new URL(request.url);

    const storyId = searchParams.get('storyId');
    const nodeId = searchParams.get('nodeId') ?? scene_id;
    const choicePathRaw = searchParams.get('choicePath');
    const prompt = searchParams.get('prompt');

    if (!storyId) {
      return NextResponse.json({ error: 'storyId is required' }, { status: 400 });
    }

    let choicePath: string[] = [];
    if (choicePathRaw) {
      try {
        choicePath = JSON.parse(choicePathRaw) as string[];
      } catch {
        return NextResponse.json({ error: 'Invalid choicePath JSON' }, { status: 400 });
      }
    }

    // Build cache key and check if we already have the image
    const cacheKey = `img:${storyId}:${nodeId}:${choicePath.join('|')}`;
    const cached = await getCachedImage(cacheKey);

    if (cached) {
      return NextResponse.json({ status: 'ready', url: cached });
    }

    // If a prompt is provided, trigger generation asynchronously
    if (prompt) {
      // Fire-and-forget image generation; client should poll again
      getOrGenerateImage(storyId, nodeId, choicePath, prompt).catch((err) => {
        console.error('[Image generation error]', err);
      });

      return NextResponse.json({ status: 'generating' });
    }

    // No cached image and no prompt to generate
    return NextResponse.json({ status: 'generating' });
  } catch (error) {
    console.error('[GET /api/image/:scene_id]', error);
    return NextResponse.json({ status: 'error', error: 'Image fetch failed' }, { status: 500 });
  }
}
