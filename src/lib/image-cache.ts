import { getCachedImage, setCachedImage } from '@/lib/redis';
import { generateImage } from '@/lib/image-providers';

/**
 * Build a deterministic cache key from story ID, node ID, and choice path.
 * Uses a simple string hash — no crypto dependency required.
 */
export function buildCacheKey(
  storyId: string,
  nodeId: string,
  choicePathHash: string,
): string {
  return `img:${storyId}:${nodeId}:${choicePathHash}`;
}

/**
 * Compute a simple deterministic hash from the choice path array.
 * Joins the choices with a separator and produces a numeric hash string.
 */
function hashChoicePath(choicePath: string[]): string {
  const str = choicePath.join('|');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Check the Redis cache for an existing image URL; if absent, generate
 * a new image using the configured provider, cache it, and return the URL.
 *
 * @param storyId     The story identifier
 * @param nodeId      The node identifier
 * @param choicePath  Array of choice IDs representing the player's path
 * @param imagePrompt The prompt to use when generating a new image
 * @returns           The (possibly newly generated) image URL
 */
export async function getOrGenerateImage(
  storyId: string,
  nodeId: string,
  choicePath: string[],
  imagePrompt: string,
): Promise<string> {
  const choicePathHash = hashChoicePath(choicePath);
  const cacheKey = buildCacheKey(storyId, nodeId, choicePathHash);

  const cached = await getCachedImage(cacheKey);
  if (cached) {
    return cached;
  }

  const imageUrl = await generateImage(imagePrompt);
  await setCachedImage(cacheKey, imageUrl);

  return imageUrl;
}
