'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { Choice } from '@/types/story';
import { ChoiceButton } from '@/components/ui/ChoiceButton';

interface ChoiceGridProps {
  choices: Choice[];
  onChoiceSelect: (choice: Choice) => void;
  disabled?: boolean;
}

export function ChoiceGrid({ choices, onChoiceSelect, disabled = false }: ChoiceGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const btns = gridRef.current?.querySelectorAll('button');
    if (!btns?.length) return;
    gsap.fromTo(
      btns,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.09, ease: 'power3.out' },
    );
  }, [choices]);

  if (!choices.length) return null;

  return (
    <div ref={gridRef} className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
      {choices.map((choice, index) => (
        <ChoiceButton
          key={choice.id}
          choice={choice}
          onClick={onChoiceSelect}
          disabled={disabled}
          index={index}
        />
      ))}
    </div>
  );
}
