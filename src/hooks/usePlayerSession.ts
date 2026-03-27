'use client';

import { useState, useEffect, useCallback } from 'react';
import type { PlayerSession } from '@/types/story';

interface UsePlayerSessionOptions {
  storyId: string;
  sessionId?: string;
}

interface UsePlayerSessionReturn {
  playerSession: PlayerSession | null;
  isLoading: boolean;
  error: string | null;
  createSession: () => Promise<PlayerSession | null>;
}

export function usePlayerSession({
  storyId,
  sessionId,
}: UsePlayerSessionOptions): UsePlayerSessionReturn {
  const [playerSession, setPlayerSession] = useState<PlayerSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const createSession = useCallback(async (): Promise<PlayerSession | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId, sessionId }),
      });

      if (!res.ok) {
        throw new Error(`Session creation failed: ${res.statusText}`);
      }

      const data = (await res.json()) as { session: PlayerSession };
      setPlayerSession(data.session);
      return data.session;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create session';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [storyId, sessionId]);

  // Initialise session on mount
  useEffect(() => {
    createSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyId]);

  return {
    playerSession,
    isLoading,
    error,
    createSession,
  };
}
