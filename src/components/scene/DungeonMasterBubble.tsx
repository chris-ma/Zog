'use client';

import { motion } from 'framer-motion';

interface DungeonMasterBubbleProps {
  children: React.ReactNode;
  /** Show a skip button inside the bubble */
  onSkip?: () => void;
  showSkip?: boolean;
}

/**
 * Renders the Dungeon Master avatar alongside a speech bubble.
 * The avatar sits on the left; the bubble grows to the right.
 */
export function DungeonMasterBubble({ children, onSkip, showSkip }: DungeonMasterBubbleProps) {
  return (
    <div className="flex items-start gap-3 sm:gap-5">
      {/* DM Avatar — fixed width so bubble fills remaining space */}
      <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 self-end mb-1">
        <DMAvatarFull />
      </div>

      {/* Speech bubble */}
      <div className="relative flex-1 min-w-0">
        {/* Bubble tail pointing left toward DM */}
        <div className="absolute -left-3 bottom-6 w-0 h-0
          border-t-[10px] border-t-transparent
          border-r-[14px] border-r-[#1e1b4b]
          border-b-[10px] border-b-transparent" />

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-[#1e1b4b] border border-purple-700/50 rounded-2xl rounded-bl-none px-5 py-4 shadow-lg"
        >
          <div className="text-base sm:text-lg leading-relaxed text-gray-100 font-medium">
            {children}
          </div>

          {showSkip && onSkip && (
            <button
              onClick={onSkip}
              className="mt-3 text-xs text-purple-400 hover:text-purple-200 underline transition-colors block"
            >
              skip →
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}

/** Full DM avatar SVG — cosmic wizard narrator */
function DMAvatarFull() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
      {/* Wizard hat */}
      <polygon points="40,6 28,30 52,30" fill="#7c3aed" />
      <rect x="24" y="29" width="32" height="7" rx="3" fill="#5b21b6" />
      {/* Stars on hat */}
      <text x="40" y="24" fontSize="7" fill="#fde68a" textAnchor="middle">★</text>
      <text x="33" y="18" fontSize="4" fill="#c4b5fd" textAnchor="middle">✦</text>
      <text x="47" y="20" fontSize="4" fill="#c4b5fd" textAnchor="middle">✦</text>
      {/* Face */}
      <circle cx="40" cy="46" r="16" fill="#fde68a" />
      {/* Eyes — slightly wide with excitement */}
      <ellipse cx="35" cy="44" rx="2.5" ry="3" fill="#1e1b4b" />
      <ellipse cx="45" cy="44" rx="2.5" ry="3" fill="#1e1b4b" />
      {/* Eye shine */}
      <circle cx="36" cy="43" r="0.9" fill="white" />
      <circle cx="46" cy="43" r="0.9" fill="white" />
      {/* Eyebrows — raised for storytelling */}
      <path d="M32 40 Q35 38 38 40" stroke="#a16207" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M42 40 Q45 38 48 40" stroke="#a16207" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Big storytelling grin */}
      <path d="M33 51 Q40 57 47 51" stroke="#92400e" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Robes */}
      <path d="M24 62 Q40 59 56 62 L54 80 L26 80 Z" fill="#7c3aed" />
      {/* Robe detail */}
      <path d="M36 63 L38 76" stroke="#5b21b6" strokeWidth="1" strokeLinecap="round" />
      <path d="M44 63 L42 76" stroke="#5b21b6" strokeWidth="1" strokeLinecap="round" />
      {/* Hands holding a tiny glowing orb */}
      <circle cx="40" cy="65" r="4" fill="#c4b5fd" opacity="0.6" />
      <circle cx="40" cy="65" r="2.5" fill="#e9d5ff" />
    </svg>
  );
}
