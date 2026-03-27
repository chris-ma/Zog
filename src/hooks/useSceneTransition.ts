'use client';

import { useState, useEffect, useCallback } from 'react';
import type { StoryNode, Choice } from '@/types/story';

interface UseSceneTransitionOptions {
  storyId: string;
  initialNodeId?: string;
  choicePath?: string[];
}

interface UseSceneTransitionReturn {
  currentNode: StoryNode | null;
  isLoading: boolean;
  isTransitioning: boolean;
  error: string | null;
  navigateToChoice: (choice: Choice) => Promise<void>;
}

export function useSceneTransition({
  storyId,
  initialNodeId,
  choicePath: externalChoicePath,
}: UseSceneTransitionOptions): UseSceneTransitionReturn {
  const [currentNode, setCurrentNode] = useState<StoryNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [choicePath, setChoicePath] = useState<string[]>(externalChoicePath ?? []);
  const [previousProse, setPreviousProse] = useState<string[]>([]);
  const [lastChoice, setLastChoice] = useState<string | undefined>(undefined);

  const fetchScene = useCallback(
    async (nodeId?: string, path?: string[], prevProse?: string[], lastChoiceText?: string) => {
      try {
        const res = await fetch('/api/scene', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            storyId,
            nodeId,
            choicePath: path ?? [],
            previousProse: prevProse ?? [],
            lastChoice: lastChoiceText,
          }),
        });

        if (!res.ok) {
          throw new Error(`Scene fetch failed: ${res.statusText}`);
        }

        const data = (await res.json()) as { scene: StoryNode; isDynamic: boolean };
        return data.scene;
      } catch (err) {
        throw err instanceof Error ? err : new Error('Unknown error fetching scene');
      }
    },
    [storyId],
  );

  // Load the initial scene on mount
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    fetchScene(initialNodeId, externalChoicePath ?? [], [], undefined)
      .then((node) => setCurrentNode(node))
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyId, initialNodeId]);

  const navigateToChoice = useCallback(
    async (choice: Choice) => {
      if (isTransitioning) return;

      setIsTransitioning(true);
      setError(null);

      const newChoicePath = [...choicePath, choice.id];
      const newPreviousProse = currentNode ? [...previousProse, currentNode.prose] : previousProse;

      try {
        const nextNode = await fetchScene(
          choice.nextNodeId,
          newChoicePath,
          newPreviousProse,
          choice.text,
        );

        setChoicePath(newChoicePath);
        setPreviousProse(newPreviousProse);
        setLastChoice(choice.text);
        setCurrentNode(nextNode);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to navigate to next scene');
      } finally {
        setIsTransitioning(false);
      }
    },
    [isTransitioning, choicePath, currentNode, previousProse, fetchScene],
  );

  return {
    currentNode,
    isLoading,
    isTransitioning,
    error,
    navigateToChoice,
  };
}
