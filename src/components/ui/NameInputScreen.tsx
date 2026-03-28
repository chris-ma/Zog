'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePlayer } from '@/context/PlayerContext';

interface NameInputScreenProps {
  storyTitle: string;
  onReady: (name: string) => void;
}

export function NameInputScreen({ storyTitle, onReady }: NameInputScreenProps) {
  const { setPlayerName } = usePlayer();
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setError('Your adventurer needs a name!');
      return;
    }
    if (trimmed.length > 30) {
      setError('Try a shorter name (30 characters max).');
      return;
    }
    setPlayerName(trimmed);
    onReady(trimmed);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0d0d1a]">
      {/* DM speech bubble intro */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl space-y-8"
      >
        {/* DM character + bubble */}
        <div className="flex items-start gap-4">
          <DMAvatarSmall />
          <div className="relative bg-white text-gray-900 rounded-2xl rounded-tl-none px-5 py-4 shadow-xl flex-1">
            <p className="text-base font-medium leading-relaxed">
              <span className="text-purple-700 font-bold">Ahem.</span> Before we begin,{' '}
              <strong>Dimension Master Zorbax</strong> needs to know what to call you. Every legendary
              adventurer needs a legendary name. What&apos;s yours?
            </p>
            {/* bubble tail */}
            <div className="absolute -left-3 top-4 w-0 h-0 border-t-[10px] border-t-transparent border-r-[14px] border-r-white border-b-[10px] border-b-transparent" />
          </div>
        </div>

        {/* Story title */}
        <p className="text-center text-gray-400 text-sm tracking-widest uppercase">
          {storyTitle}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => { setInputValue(e.target.value); setError(''); }}
            placeholder="Enter your name…"
            autoFocus
            className="w-full rounded-xl border-2 border-purple-600 bg-[#1a1a2e] text-white text-xl text-center px-4 py-4 placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
            maxLength={30}
          />
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            className="w-full rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-lg py-4 transition-colors"
          >
            Begin the Adventure →
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

function DMAvatarSmall() {
  return (
    <div className="flex-shrink-0 w-14 h-14 mt-1">
      <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Hat */}
        <polygon points="28,4 20,22 36,22" fill="#7c3aed" />
        <rect x="16" y="21" width="24" height="5" rx="2" fill="#5b21b6" />
        {/* Star on hat */}
        <text x="26" y="18" fontSize="6" fill="#fde68a" textAnchor="middle">★</text>
        {/* Face */}
        <circle cx="28" cy="34" r="12" fill="#fde68a" />
        {/* Eyes */}
        <circle cx="24" cy="32" r="2" fill="#1e1b4b" />
        <circle cx="32" cy="32" r="2" fill="#1e1b4b" />
        {/* Smile */}
        <path d="M23 38 Q28 42 33 38" stroke="#1e1b4b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Robe */}
        <path d="M16 46 Q28 44 40 46 L38 56 L18 56 Z" fill="#7c3aed" />
      </svg>
    </div>
  );
}
