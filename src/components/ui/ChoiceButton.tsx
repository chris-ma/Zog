'use client';

import { motion } from 'framer-motion';
import type { Choice } from '@/types/story';

interface ChoiceButtonProps {
  choice: Choice;
  onClick: (choice: Choice) => void;
  disabled?: boolean;
  index?: number;
}

export function ChoiceButton({ choice, onClick, disabled = false, index = 0 }: ChoiceButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      whileHover={disabled ? {} : { scale: 1.02, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={() => !disabled && onClick(choice)}
      disabled={disabled}
      className={[
        'w-full text-left px-5 py-4 rounded-xl border transition-all duration-200',
        'font-crimson text-base leading-snug',
        disabled
          ? 'border-gray-700 text-gray-500 cursor-not-allowed opacity-60'
          : 'border-gray-600 text-gray-200 hover:border-primary hover:text-white hover:bg-gray-800/60 cursor-pointer',
      ].join(' ')}
    >
      <span className="block font-semibold">{choice.text}</span>
      {choice.consequence && (
        <span className="block mt-1 text-xs text-gray-500 italic">{choice.consequence}</span>
      )}
    </motion.button>
  );
}
