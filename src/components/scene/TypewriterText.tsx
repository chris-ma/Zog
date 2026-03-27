'use client';

import { useEffect, useRef, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  onComplete?: () => void;
  skip?: boolean;
  className?: string;
  /** Characters per second (default: 40) */
  speed?: number;
}

export function TypewriterText({
  text,
  onComplete,
  skip = false,
  className = '',
  speed = 40,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState('');
  const rafRef = useRef<number | null>(null);
  const indexRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (skip) {
      setDisplayed(text);
      onComplete?.();
      return;
    }

    indexRef.current = 0;
    lastTimeRef.current = null;
    setDisplayed('');

    const msPerChar = 1000 / speed;

    const tick = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }

      const elapsed = timestamp - lastTimeRef.current;
      const charsToAdd = Math.floor(elapsed / msPerChar);

      if (charsToAdd > 0) {
        indexRef.current = Math.min(indexRef.current + charsToAdd, text.length);
        setDisplayed(text.slice(0, indexRef.current));
        lastTimeRef.current = timestamp - (elapsed % msPerChar);
      }

      if (indexRef.current < text.length) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        onComplete?.();
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [text, skip, speed, onComplete]);

  return (
    <p className={`font-crimson leading-relaxed whitespace-pre-wrap ${className}`}>{displayed}</p>
  );
}
