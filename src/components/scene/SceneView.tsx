'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import type { StoryNode, Choice } from '@/types/story';
import { SceneImage } from '@/components/scene/SceneImage';
import { TypewriterText } from '@/components/scene/TypewriterText';
import { ChoiceGrid } from '@/components/scene/ChoiceGrid';
import { useSceneTransition } from '@/hooks/useSceneTransition';
import { useImagePoller } from '@/hooks/useImagePoller';
import { usePlayerSession } from '@/hooks/usePlayerSession';

interface SceneViewProps {
  storyId: string;
  initialNodeId?: string;
  sessionId?: string;
}

export function SceneView({ storyId, initialNodeId, sessionId }: SceneViewProps) {
  const router = useRouter();
  const [proseComplete, setProseComplete] = useState(false);
  const [skipTypewriter, setSkipTypewriter] = useState(false);

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
      await navigateToChoice(choice);

      if (currentNode?.isTerminal) {
        router.push(`/story/${storyId}/ending?type=${currentNode.endingType}&session=${playerSession?.id}`);
      }
    },
    [currentNode, navigateToChoice, router, storyId, playerSession],
  );

  const handleProseComplete = useCallback(() => {
    setProseComplete(true);
  }, []);

  const handleSkipClick = useCallback(() => {
    setSkipTypewriter(true);
    setProseComplete(true);
  }, []);

  if (isLoading && !currentNode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 animate-pulse font-cinzel text-lg">Loading scene…</div>
      </div>
    );
  }

  if (!currentNode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 font-cinzel">Scene not found.</div>
      </div>
    );
  }

  const displayedImageUrl = currentNode.cachedImageUrl ?? imageUrl ?? null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentNode.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen max-w-4xl mx-auto px-4 py-8 space-y-8"
      >
        {/* Scene Image */}
        <SceneImage
          src={displayedImageUrl}
          alt={currentNode.title}
          isLoading={isImageLoading}
          className="w-full shadow-2xl"
        />

        {/* Scene Title */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-3xl font-cinzel font-bold text-center"
        >
          {currentNode.title}
        </motion.h1>

        {/* Prose */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="relative"
        >
          <TypewriterText
            text={currentNode.prose}
            onComplete={handleProseComplete}
            skip={skipTypewriter}
            className="text-lg text-gray-300"
          />
          {!proseComplete && (
            <button
              onClick={handleSkipClick}
              className="mt-3 text-xs text-gray-500 hover:text-gray-300 underline transition-colors"
            >
              Skip
            </button>
          )}
        </motion.div>

        {/* Choices */}
        <AnimatePresence>
          {proseComplete && !currentNode.isTerminal && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ChoiceGrid
                choices={currentNode.choices}
                onChoiceSelect={handleChoiceSelect}
                disabled={isTransitioning}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Terminal scene CTA */}
        {proseComplete && currentNode.isTerminal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center space-y-4"
          >
            <p className="font-cinzel text-gray-400 italic">Your story has ended.</p>
            <button
              onClick={() =>
                router.push(
                  `/story/${storyId}/ending?type=${currentNode.endingType}&session=${playerSession?.id}`,
                )
              }
              className="px-8 py-3 rounded-xl bg-primary text-white font-cinzel font-semibold hover:opacity-90 transition-opacity"
            >
              See Your Ending
            </button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
