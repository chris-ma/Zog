'use client';

import { useState, useCallback, useRef } from 'react';

export interface StoryHistoryEntry {
  title: string;
  prose: string;
  choiceText: string | null; // null on the terminal node
}
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import type { Choice } from '@/types/story';
import { SceneImage } from '@/components/scene/SceneImage';
import { TypewriterText } from '@/components/scene/TypewriterText';
import { ChoiceGrid } from '@/components/scene/ChoiceGrid';
import { DungeonMasterBubble } from '@/components/scene/DungeonMasterBubble';
import { useSceneTransition } from '@/hooks/useSceneTransition';
import { useImagePoller } from '@/hooks/useImagePoller';
import { usePlayerSession } from '@/hooks/usePlayerSession';
import { usePlayer, injectPlayerName } from '@/context/PlayerContext';

interface SceneViewProps {
  storyId: string;
  initialNodeId?: string;
  sessionId?: string;
}

export function SceneView({ storyId, initialNodeId, sessionId }: SceneViewProps) {
  const router = useRouter();
  const { playerName } = usePlayer();
  const [proseComplete, setProseComplete] = useState(false);
  const [skipTypewriter, setSkipTypewriter] = useState(false);
  const historyRef = useRef<StoryHistoryEntry[]>([]);

  const { currentNode, isLoading, isTransitioning, navigateToChoice } = useSceneTransition({
    storyId,
    initialNodeId,
  });

  const { playerSession } = usePlayerSession({ storyId, sessionId });

  const sceneId = currentNode?.id ?? initialNodeId ?? 'initial';
  const { imageUrl, isImageLoading } = useImagePoller({
    sceneId,
    storyId,
    nodeId: sceneId,
    choicePath: playerSession?.choicePath ?? [],
    prompt: currentNode?.imagePrompt,
    enabled: !!currentNode && !currentNode.cachedImageUrl,
    cachedUrl: currentNode?.cachedImageUrl,
  });

  const handleChoiceSelect = useCallback(
    async (choice: Choice) => {
      if (currentNode?.isTerminal) return;
      // Record current scene + the choice being made
      historyRef.current = [
        ...historyRef.current,
        { title: currentNode?.title ?? '', prose: currentNode?.prose ?? '', choiceText: choice.text },
      ];
      setProseComplete(false);
      setSkipTypewriter(false);
      await navigateToChoice(choice);
    },
    [currentNode, navigateToChoice],
  );

  const handleProseComplete = useCallback(() => setProseComplete(true), []);
  const handleSkip = useCallback(() => {
    setSkipTypewriter(true);
    setProseComplete(true);
  }, []);

  const handleEndingCTA = useCallback(() => {
    // Save full history including terminal node to localStorage
    const sessionKey = `cyoa_history_${storyId}_${playerSession?.id ?? 'anon'}`;
    const fullHistory: StoryHistoryEntry[] = [
      ...historyRef.current,
      { title: currentNode?.title ?? '', prose: currentNode?.prose ?? '', choiceText: null },
    ];
    try {
      localStorage.setItem(sessionKey, JSON.stringify(fullHistory));
    } catch {
      // localStorage may be unavailable; PDF will show without history
    }
    router.push(
      `/story/${storyId}/ending?type=${currentNode?.endingType ?? 'neutral'}&nodeId=${currentNode?.id ?? ''}&session=${playerSession?.id ?? ''}&histKey=${encodeURIComponent(sessionKey)}`,
    );
  }, [router, storyId, currentNode, playerSession]);

  if (isLoading && !currentNode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d1a]">
        <div className="text-purple-300 animate-pulse text-lg">Loading scene…</div>
      </div>
    );
  }

  if (!currentNode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d1a]">
        <div className="text-gray-400">Scene not found.</div>
      </div>
    );
  }

  const displayedImageUrl = currentNode.cachedImageUrl ?? imageUrl ?? null;
  const prose = injectPlayerName(currentNode.prose, playerName);
  const title = injectPlayerName(currentNode.title, playerName);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentNode.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45 }}
        className="min-h-screen bg-[#0d0d1a] flex flex-col"
      >
        <div className="w-full">
          <SceneImage
            src={displayedImageUrl}
            alt={title}
            isLoading={isImageLoading && !displayedImageUrl}
            className="w-full rounded-none sm:rounded-b-2xl"
          />
        </div>

        <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.35 }}
            className="text-xl sm:text-2xl font-bold text-purple-300 text-center tracking-wide"
          >
            {title}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            <DungeonMasterBubble onSkip={handleSkip} showSkip={!proseComplete}>
              <TypewriterText
                text={prose}
                onComplete={handleProseComplete}
                skip={skipTypewriter}
                className="text-gray-100"
              />
            </DungeonMasterBubble>
          </motion.div>

          <AnimatePresence>
            {proseComplete && !currentNode.isTerminal && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <ChoiceGrid
                  choices={currentNode.choices}
                  onChoiceSelect={handleChoiceSelect}
                  disabled={isTransitioning}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {proseComplete && currentNode.isTerminal && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-4 pb-8"
            >
              <p className="text-purple-300 italic text-sm">✦ Your story has ended. ✦</p>
              <button
                onClick={handleEndingCTA}
                className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors"
              >
                See Your Ending
              </button>
              <div>
                <button
                  onClick={() => router.push(`/story/${storyId}`)}
                  className="text-xs text-gray-500 hover:text-gray-300 underline transition-colors"
                >
                  Play again from the start
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
