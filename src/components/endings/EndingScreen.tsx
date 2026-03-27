'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { EndingType } from '@/types/story';

interface EndingScreenProps {
  storyId: string;
  endingType?: string;
  sessionId?: string;
}

const ENDING_CONFIG: Record<
  EndingType,
  { label: string; color: string; description: string; icon: string }
> = {
  victory: {
    label: 'Victory',
    color: 'text-yellow-400',
    description: 'You triumphed against all odds. Your legend will be told for generations.',
    icon: '✦',
  },
  defeat: {
    label: 'Defeat',
    color: 'text-red-400',
    description: 'The darkness claimed you. Perhaps another path awaits.',
    icon: '✗',
  },
  bittersweet: {
    label: 'A Bittersweet End',
    color: 'text-purple-400',
    description: 'You achieved something, but at a cost. The world is changed — as are you.',
    icon: '◈',
  },
  neutral: {
    label: 'The Journey Ends',
    color: 'text-gray-300',
    description: 'Every adventure must reach its final page. Yours ends here.',
    icon: '○',
  },
  secret: {
    label: 'A Hidden Ending',
    color: 'text-teal-400',
    description: 'Few find this path. You have uncovered a truth known only to the bold.',
    icon: '◆',
  },
};

const DEFAULT_ENDING = ENDING_CONFIG.neutral;

export function EndingScreen({ storyId, endingType, sessionId: _sessionId }: EndingScreenProps) {
  const [particlesReady, setParticlesReady] = useState(false);

  const config =
    endingType && endingType in ENDING_CONFIG
      ? ENDING_CONFIG[endingType as EndingType]
      : DEFAULT_ENDING;

  useEffect(() => {
    // Placeholder for tsparticles initialisation
    // TODO: Initialise tsParticles here once the tsparticles package is configured
    setParticlesReady(true);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-16 overflow-hidden">
      {/* Particles slot */}
      {particlesReady && (
        <div id="tsparticles" className="absolute inset-0 pointer-events-none" aria-hidden="true" />
      )}

      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative z-10 max-w-2xl w-full text-center space-y-8"
      >
        {/* Ending Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 14 }}
          className={`text-7xl ${config.color} select-none`}
        >
          {config.icon}
        </motion.div>

        {/* Ending Label */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className={`text-4xl font-cinzel font-bold ${config.color}`}
        >
          {config.label}
        </motion.h1>

        {/* Ending Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-xl font-crimson text-gray-300 leading-relaxed italic"
        >
          {config.description}
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
        >
          <Link
            href={`/story/${storyId}/play`}
            className="px-8 py-3 rounded-xl border border-gray-600 hover:border-gray-400 font-cinzel text-sm transition-colors"
          >
            Play Again
          </Link>
          <Link
            href="/"
            className="px-8 py-3 rounded-xl bg-primary text-white font-cinzel text-sm hover:opacity-90 transition-opacity"
          >
            Story Library
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
