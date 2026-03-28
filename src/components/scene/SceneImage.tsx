'use client';

import { useState } from 'react';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

interface SceneImageProps {
  src?: string | null;
  alt: string;
  isLoading?: boolean;
  className?: string;
}

/** Route external image URLs through our server-side proxy to avoid host blocks. */
function toProxiedSrc(src: string): string {
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return `/api/image-proxy?url=${encodeURIComponent(src)}`;
  }
  return src;
}

export function SceneImage({ src, alt, isLoading = false, className = '' }: SceneImageProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [transform, setTransform] = useState('perspective(800px) rotateX(0deg) rotateY(0deg)');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTransform(`perspective(800px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(800px) rotateX(0deg) rotateY(0deg)');
  };

  if (isLoading) {
    return <LoadingSkeleton className={className} aspectRatio="aspect-video" />;
  }

  if (!src || imgError) {
    return (
      <div
        className={`rounded-xl aspect-video bg-gradient-to-br from-indigo-950 via-purple-950 to-black flex items-center justify-center ${className}`}
      >
        <span className="text-5xl opacity-20">✦</span>
      </div>
    );
  }

  const proxiedSrc = toProxiedSrc(src);

  return (
    <div
      style={{ transform, transition: 'transform 0.15s ease-out' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-xl overflow-hidden aspect-video will-change-transform ${className}`}
    >
      {/* Skeleton shown until the img fires onLoad */}
      {!imgLoaded && (
        <div className="absolute inset-0">
          <LoadingSkeleton className="w-full h-full rounded-none" />
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={proxiedSrc}
        alt={alt}
        onLoad={() => setImgLoaded(true)}
        onError={() => setImgError(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          imgLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
