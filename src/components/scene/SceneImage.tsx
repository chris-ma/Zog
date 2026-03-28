'use client';

import { useState } from 'react';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

interface SceneImageProps {
  src?: string | null;
  alt: string;
  isLoading?: boolean;
  className?: string;
}

type LoadStage = 'proxy' | 'direct' | 'error';

/** Route external image URLs through our server-side proxy first. */
function toProxiedSrc(src: string): string {
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return `/api/image-proxy?url=${encodeURIComponent(src)}`;
  }
  return src;
}

function isExternal(src: string) {
  return src.startsWith('http://') || src.startsWith('https://');
}

export function SceneImage({ src, alt, isLoading = false, className = '' }: SceneImageProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [stage, setStage] = useState<LoadStage>('proxy');
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

  const handleError = () => {
    if (stage === 'proxy') {
      // Proxy failed — try loading the URL directly in the browser
      setStage('direct');
    } else {
      // Both failed — show gradient fallback
      setStage('error');
    }
  };

  if (isLoading) {
    return <LoadingSkeleton className={className} aspectRatio="aspect-video" />;
  }

  if (!src || stage === 'error') {
    return (
      <div
        className={`rounded-xl aspect-video bg-gradient-to-br from-indigo-950 via-purple-950 to-black flex items-center justify-center ${className}`}
      >
        <span className="text-5xl opacity-20">✦</span>
      </div>
    );
  }

  const activeSrc =
    stage === 'proxy' && isExternal(src) ? toProxiedSrc(src) : src;

  return (
    <div
      style={{ transform, transition: 'transform 0.15s ease-out' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-xl overflow-hidden aspect-video will-change-transform ${className}`}
    >
      {/* Skeleton visible until onLoad fires */}
      {!imgLoaded && (
        <div className="absolute inset-0">
          <LoadingSkeleton className="w-full h-full rounded-none" />
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={activeSrc}
        src={activeSrc}
        alt={alt}
        onLoad={() => setImgLoaded(true)}
        onError={handleError}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          imgLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
