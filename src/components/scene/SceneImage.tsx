'use client';

import { useState } from 'react';
import Image from 'next/image';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

interface SceneImageProps {
  src?: string | null;
  alt: string;
  isLoading?: boolean;
  className?: string;
}

export function SceneImage({ src, alt, isLoading = false, className = '' }: SceneImageProps) {
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

  return (
    <div
      style={{ transform, transition: 'transform 0.15s ease-out' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-xl overflow-hidden aspect-video will-change-transform ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setImgError(true)}
        sizes="(max-width: 768px) 100vw, 800px"
        priority
      />
    </div>
  );
}
