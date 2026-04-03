'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import type { Choice } from '@/types/story';

interface ChoiceButtonProps {
  choice: Choice;
  onClick: (choice: Choice) => void;
  disabled?: boolean;
  index?: number;
}

export function ChoiceButton({ choice, onClick, disabled = false, index = 0 }: ChoiceButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = () => {
    if (disabled) return;
    gsap.to(btnRef.current, { scale: 1.02, y: -3, duration: 0.22, ease: 'power2.out' });
    gsap.to(btnRef.current, { borderColor: 'rgba(139,92,246,0.8)', duration: 0.2 });
  };
  const handleMouseLeave = () => {
    if (disabled) return;
    gsap.to(btnRef.current, { scale: 1, y: 0, duration: 0.3, ease: 'power2.out' });
    gsap.to(btnRef.current, { borderColor: 'rgba(75,85,99,1)', duration: 0.25 });
  };
  const handleMouseDown = () => {
    if (disabled) return;
    gsap.to(btnRef.current, { scale: 0.97, duration: 0.1 });
  };
  const handleMouseUp = () => {
    if (disabled) return;
    gsap.to(btnRef.current, { scale: 1.02, duration: 0.1 });
  };

  return (
    <button
      ref={btnRef}
      onClick={() => !disabled && onClick(choice)}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseLeave}
      style={{ opacity: 0, transform: 'translateY(16px)' }}
      // Entrance is handled by ChoiceGrid's GSAP stagger
      className={[
        'w-full text-left px-5 py-4 rounded-xl border transition-colors duration-200',
        'font-crimson text-base leading-snug',
        disabled
          ? 'border-gray-700 text-gray-500 cursor-not-allowed opacity-60'
          : 'border-gray-600 text-gray-200 hover:text-white hover:bg-gray-800/60 cursor-pointer',
      ].join(' ')}
    >
      <span className="block font-semibold">{choice.text}</span>
      {choice.consequence && (
        <span className="block mt-1 text-xs text-gray-500 italic">{choice.consequence}</span>
      )}
    </button>
  );
}
