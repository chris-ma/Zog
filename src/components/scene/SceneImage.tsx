'use client';

import { useState } from 'react';

interface SceneImageProps {
  src?: string | null;
  alt: string;
  isLoading?: boolean;
  className?: string;
}

export function SceneImage({ src, alt, isLoading = false, className = '' }: SceneImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [transform, setTransform] = useState('perspective(800px) rotateX(0deg) rotateY(0deg)');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTransform(`perspective(800px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`);
  };

  const showFallback = !src || errored;

  if (showFallback || isLoading) {
    return (
      <div
        className={`rounded-xl aspect-video bg-gradient-to-br from-indigo-950 via-purple-950 to-black flex items-center justify-center ${className}`}
      >
        {isLoading && (
          <div className="w-8 h-8 border-2 border-purple-500/40 border-t-purple-400 rounded-full animate-spin" />
        )}
        {!isLoading && <span className="text-5xl opacity-20">✦</span>}
      </div>
    );
  }

  return (
    <div
      style={{ transform, transition: 'transform 0.15s ease-out' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTransform('perspective(800px) rotateX(0deg) rotateY(0deg)')}
      className={`relative rounded-xl overflow-hidden aspect-video will-change-transform bg-[#0d0d1a] ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {/* Spinner shown while image is loading */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-purple-500/40 border-t-purple-400 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
