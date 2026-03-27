'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Story } from '@/types/story';
import { StoryCard } from '@/components/library/StoryCard';

export function StoryLibrary() {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/story')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch stories');
        return res.json() as Promise<{ stories: Story[] }>;
      })
      .then((data) => setStories(data.stories))
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <header className="text-center space-y-4 py-8">
          <motion.h1
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-cinzel font-bold"
          >
            Choose Your Adventure
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg text-gray-400 font-crimson max-w-xl mx-auto"
          >
            Every choice shapes your destiny. Select a story to begin your journey.
          </motion.p>
        </header>

        {/* Story Grid */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-700 bg-gray-900/60 animate-pulse">
                <div className="aspect-video bg-gray-800 rounded-t-xl" />
                <div className="p-5 space-y-3">
                  <div className="h-6 bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-800 rounded w-full" />
                  <div className="h-4 bg-gray-800 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-16 space-y-4">
            <p className="text-red-400 font-cinzel">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-lg border border-gray-600 text-sm hover:border-gray-400 transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !error && stories.length === 0 && (
          <div className="text-center py-16 space-y-4">
            <p className="text-gray-400 font-cinzel text-xl">No stories yet.</p>
            <p className="text-gray-600 font-crimson">
              Adventures are being written. Check back soon.
            </p>
          </div>
        )}

        {!isLoading && !error && stories.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
