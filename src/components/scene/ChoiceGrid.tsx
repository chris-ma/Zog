'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { Choice } from '@/types/story';
import { ChoiceButton } from '@/components/ui/ChoiceButton';

interface ChoiceGridProps {
  choices: Choice[];
  onChoiceSelect: (choice: Choice) => void;
  disabled?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

export function ChoiceGrid({ choices, onChoiceSelect, disabled = false }: ChoiceGridProps) {
  if (choices.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        key="choice-grid"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        exit="exit"
        className="grid gap-3 sm:grid-cols-1 md:grid-cols-2"
      >
        {choices.map((choice, index) => (
          <ChoiceButton
            key={choice.id}
            choice={choice}
            onClick={onChoiceSelect}
            disabled={disabled}
            index={index}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
