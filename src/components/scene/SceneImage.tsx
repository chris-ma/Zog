'use client';

import { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [{ transform }, api] = useSpring(() => ({
    transform: 'perspective(800px) rotateX(0deg) rotateY(0deg)',
    config: { mass: 1, tension: 180, friction: 30 },
  }));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    setMousePos({ x, y });
    api.start({
      transform: `perspective(800px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`,
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
    api.start({
      transform: 'perspective(800px) rotateX(0deg) rotateY(0deg)',
    });
  };

  if (isLoading || (!src && !imgError)) {
    return <LoadingSkeleton className={className} aspectRatio="aspect-video" />;
  }

  if (!src || imgError) {
    // Fallback gradient
    return (
      <div
        className={`rounded-xl aspect-video bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center ${className}`}
      >
        <span className="text-4xl opacity-30">✦</span>
      </div>
    );
  }

  return (
    <animated.div
      style={{ transform }}
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
    </animated.div>
  );
}
