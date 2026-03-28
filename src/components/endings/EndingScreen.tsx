'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePlayer, injectPlayerName } from '@/context/PlayerContext';
import type { StoryNode } from '@/types/story';

interface EndingScreenProps {
  storyId: string;
  endingType?: string;
  nodeId?: string;
  sessionId?: string;
}

const BADGE_STYLES: Record<string, { bg: string; text: string }> = {
  // Burp Quest
  EPIC:      { bg: 'bg-yellow-500/20',  text: 'text-yellow-300'  },
  GROSS:     { bg: 'bg-green-500/20',   text: 'text-green-300'   },
  WEIRD:     { bg: 'bg-pink-500/20',    text: 'text-pink-300'    },
  AWESOME:   { bg: 'bg-blue-500/20',    text: 'text-blue-300'    },
  SILLY:     { bg: 'bg-orange-500/20',  text: 'text-orange-300'  },
  // Double Life Drama
  LEGENDARY: { bg: 'bg-yellow-400/20', text: 'text-yellow-200'  },
  ICONIC:    { bg: 'bg-fuchsia-500/20', text: 'text-fuchsia-300' },
  SWEET:     { bg: 'bg-rose-500/20',   text: 'text-rose-300'    },
  MESSY:     { bg: 'bg-amber-500/20',  text: 'text-amber-300'   },
  DRAMATIC:  { bg: 'bg-red-500/20',    text: 'text-red-300'     },
};

const DEFAULT_BADGE = { bg: 'bg-purple-500/20', text: 'text-purple-300' };

const BADGE_EMOJIS: Record<string, string> = {
  EPIC: '⚔️', GROSS: '🤢', WEIRD: '🌀', AWESOME: '🌟', SILLY: '🤪',
  LEGENDARY: '👑', ICONIC: '💅', SWEET: '💖', MESSY: '💥', DRAMATIC: '🎭',
};

export function EndingScreen({ storyId, endingType, nodeId, sessionId: _sessionId }: EndingScreenProps) {
  const { playerName } = usePlayer();
  const [node, setNode] = useState<StoryNode | null>(null);
  const [isLoading, setIsLoading] = useState(!!nodeId);

  const fetchNode = useCallback(async () => {
    if (!nodeId) return;
    try {
      const res = await fetch('/api/scene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId, nodeId, choicePath: [] }),
      });
      if (res.ok) {
        const data = (await res.json()) as { scene: StoryNode };
        setNode(data.scene);
      }
    } finally {
      setIsLoading(false);
    }
  }, [storyId, nodeId]);

  useEffect(() => { fetchNode(); }, [fetchNode]);

  const badge = node?.endingBadge ?? null;
  const badgeStyle = badge ? (BADGE_STYLES[badge] ?? DEFAULT_BADGE) : DEFAULT_BADGE;
  const title = node ? injectPlayerName(node.title, playerName) : 'Your Story Ends';
  const prose = node ? injectPlayerName(node.prose, playerName) : null;
  const flavourLine = endingType === 'victory'
    ? 'You triumphed against all odds. Legend status: achieved.'
    : 'Every adventure reaches its final page.';

  return (
    <div className="min-h-screen bg-[#0d0d1a] flex flex-col items-center justify-start px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl space-y-8"
      >
        {/* Badge */}
        {badge && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 14 }}
            className="flex justify-center"
          >
            <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold tracking-widest uppercase ${badgeStyle.bg} ${badgeStyle.text}`}>
              {BADGE_EMOJIS[badge] ?? '✦'} {badge} ENDING
            </span>
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className={`text-3xl sm:text-4xl font-cinzel font-bold text-center ${badgeStyle.text}`}
        >
          {isLoading ? '…' : title}
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
        />

        {/* Ending prose */}
        {prose && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-[#1a1a2e] border border-purple-800/30 rounded-2xl px-6 py-5 space-y-4"
          >
            {prose.split('\n\n').map((para, i) => (
              <p key={i} className="text-gray-300 leading-relaxed font-crimson text-lg">
                {para}
              </p>
            ))}
          </motion.div>
        )}

        {!prose && !isLoading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-gray-400 italic font-crimson text-xl"
          >
            {flavourLine}
          </motion.p>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center text-purple-400/60 text-sm tracking-widest uppercase font-cinzel"
        >
          ✦ The End ✦
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center pt-2"
        >
          <Link
            href={`/story/${storyId}`}
            className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-center transition-colors"
          >
            Play Again
          </Link>
          <Link
            href="/"
            className="px-8 py-3 rounded-xl border border-gray-600 hover:border-gray-400 text-gray-300 font-medium text-center transition-colors"
          >
            Story Library
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
