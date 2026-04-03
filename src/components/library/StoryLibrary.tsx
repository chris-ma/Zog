'use client';

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import type { Story } from '@/types/story';
import { StoryCard } from '@/components/library/StoryCard';

export function StoryLibrary() {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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

  // Animate header on mount
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const children = el.querySelectorAll('[data-gsap]');
    gsap.fromTo(
      children,
      { opacity: 0, y: -24 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out' },
    );
  }, []);

  // Stagger cards in once stories load
  useEffect(() => {
    if (!stories.length || !gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('[data-card]');
    gsap.fromTo(
      cards,
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.1, ease: 'power3.out', delay: 0.1 },
    );
  }, [stories]);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <header ref={headerRef} className="text-center space-y-4 py-8">
          <h1
            data-gsap
            className="text-5xl font-cinzel font-bold opacity-0"
          >
            Choose Your Adventure
          </h1>
          <p
            data-gsap
            className="text-lg text-gray-400 font-crimson max-w-xl mx-auto opacity-0"
          >
            Every choice shapes your destiny. Select a story to begin your journey.
          </p>
        </header>

        {/* Loading skeletons */}
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
            <p className="text-gray-600 font-crimson">Adventures are being written. Check back soon.</p>
          </div>
        )}

        {!isLoading && !error && stories.length > 0 && (
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {stories.map((story) => (
              <div key={story.id} data-card>
                <StoryCard story={story} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
