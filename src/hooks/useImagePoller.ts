'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseImagePollerOptions {
  sceneId: string;
  storyId: string;
  nodeId: string;
  choicePath?: string[];
  prompt?: string | null;
  /** If true, polling is active. Default: true */
  enabled?: boolean;
  /** If the node already has a cached URL, use it directly. */
  cachedUrl?: string | null;
  /** Polling interval in milliseconds. Default: 1500 */
  intervalMs?: number;
}

interface UseImagePollerReturn {
  imageUrl: string | null;
  isImageLoading: boolean;
  imageError: string | null;
}

type ImageStatus = 'ready' | 'generating' | 'error';

interface ImagePollResponse {
  status: ImageStatus;
  url?: string;
  error?: string;
}

export function useImagePoller({
  sceneId,
  storyId,
  nodeId,
  choicePath = [],
  prompt,
  enabled = true,
  cachedUrl,
  intervalMs = 1500,
}: UseImagePollerOptions): UseImagePollerReturn {
  const [imageUrl, setImageUrl] = useState<string | null>(cachedUrl ?? null);
  const [isImageLoading, setIsImageLoading] = useState(!cachedUrl && enabled && !!prompt);
  const [imageError, setImageError] = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);

  // Update state when a cached URL is provided
  useEffect(() => {
    if (cachedUrl) {
      setImageUrl(cachedUrl);
      setIsImageLoading(false);
    }
  }, [cachedUrl]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const pollImage = useCallback(async () => {
    if (!isMountedRef.current) return;

    const params = new URLSearchParams({
      storyId,
      nodeId,
      choicePath: JSON.stringify(choicePath),
      ...(prompt ? { prompt } : {}),
    });

    try {
      const res = await fetch(`/api/image/${encodeURIComponent(sceneId)}?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Image poll failed: ${res.statusText}`);
      }

      const data = (await res.json()) as ImagePollResponse;

      if (!isMountedRef.current) return;

      if (data.status === 'ready' && data.url) {
        setImageUrl(data.url);
        setIsImageLoading(false);
        stopPolling();
      } else if (data.status === 'error') {
        setImageError(data.error ?? 'Image generation failed');
        setIsImageLoading(false);
        stopPolling();
      }
      // 'generating' — keep polling
    } catch (err) {
      if (!isMountedRef.current) return;
      setImageError(err instanceof Error ? err.message : 'Unknown polling error');
      setIsImageLoading(false);
      stopPolling();
    }
  }, [sceneId, storyId, nodeId, choicePath, prompt, stopPolling]);

  useEffect(() => {
    isMountedRef.current = true;

    if (!enabled || cachedUrl || !prompt) {
      return;
    }

    setIsImageLoading(true);
    setImageError(null);

    // Start immediately, then poll every intervalMs
    void pollImage();
    intervalRef.current = setInterval(() => {
      void pollImage();
    }, intervalMs);

    return () => {
      isMountedRef.current = false;
      stopPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneId, enabled, cachedUrl, prompt]);

  return { imageUrl, isImageLoading, imageError };
}
