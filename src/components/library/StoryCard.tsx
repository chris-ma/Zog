'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { TransitionLink } from '@/components/ui/TransitionLink';
import type { Story } from '@/types/story';

interface StoryCardProps {
  story: Story;
}

const GENRE_COLORS: Record<string, string> = {
  fantasy: 'bg-purple-900/50 text-purple-300',
  'sci-fi': 'bg-blue-900/50 text-blue-300',
  horror: 'bg-red-900/50 text-red-300',
  mystery: 'bg-yellow-900/50 text-yellow-300',
  romance: 'bg-pink-900/50 text-pink-300',
  thriller: 'bg-orange-900/50 text-orange-300',
  historical: 'bg-amber-900/50 text-amber-300',
  adventure: 'bg-green-900/50 text-green-300',
};

function CoverImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Handle images already in cache before React attaches onLoad
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src]);

  if (errored) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center">
        <span className="text-5xl opacity-20">✦</span>
      </div>
    );
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black" />
      )}
    </>
  );
}

export function StoryCard({ story }: StoryCardProps) {
  const cardRef = useRef<HTMLElement>(null);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, { y: -6, scale: 1.02, duration: 0.25, ease: 'power2.out' });
    gsap.to(cardRef.current, { borderColor: 'rgba(156,163,175,0.6)', duration: 0.2 });
  };
  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { y: 0, scale: 1, duration: 0.35, ease: 'power2.out' });
    gsap.to(cardRef.current, { borderColor: 'rgba(55,65,81,1)', duration: 0.3 });
  };
  const handleMouseDown = () => gsap.to(cardRef.current, { scale: 0.97, duration: 0.1 });
  const handleMouseUp = () => gsap.to(cardRef.current, { scale: 1.02, duration: 0.1 });

  return (
    <TransitionLink href={`/story/${story.id}`}>
      <article
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseLeave}
        className="rounded-xl border border-gray-700 overflow-hidden bg-gray-900/60 backdrop-blur-sm cursor-pointer h-full flex flex-col"
      >
        {/* Cover Image */}
        <div className="relative aspect-video bg-gray-900 flex-shrink-0">
          {story.coverImageUrl ? (
            <CoverImage src={story.coverImageUrl} alt={story.title} />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center">
              <span className="text-5xl opacity-20">✦</span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5 flex flex-col gap-3 flex-1">
          <h3 className="text-xl font-cinzel font-semibold leading-tight">{story.title}</h3>
          <p className="text-sm text-gray-400 font-crimson leading-relaxed line-clamp-3">
            {story.description}
          </p>

          {/* Genre Tags */}
          <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
            {story.genre.map((g) => (
              <span
                key={g}
                className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${GENRE_COLORS[g] ?? 'bg-gray-800 text-gray-400'}`}
              >
                {g}
              </span>
            ))}
          </div>

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-800">
            <span>~{story.estimatedMinutes} min</span>
            <span className="capitalize">{story.mood}</span>
          </div>
        </div>
      </article>
    </TransitionLink>
  );
}
