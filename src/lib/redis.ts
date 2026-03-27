import { Redis } from '@upstash/redis';

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

export const redis =
  globalForRedis.redis ??
  new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis;
}

/**
 * Retrieve a cached image URL by cache key.
 * Returns null if the key does not exist.
 */
export async function getCachedImage(key: string): Promise<string | null> {
  const value = await redis.get<string>(key);
  return value ?? null;
}

/**
 * Store an image URL in the cache.
 * @param key   Cache key
 * @param url   Image URL to cache
 * @param ttl   Time-to-live in seconds (default: 7 days)
 */
export async function setCachedImage(
  key: string,
  url: string,
  ttl: number = 604800,
): Promise<void> {
  await redis.set(key, url, { ex: ttl });
}
