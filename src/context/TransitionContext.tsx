'use client';

import { createContext, useContext, useRef, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';

interface TransitionContextValue {
  navigate: (href: string) => void;
  overlayRef: React.RefObject<HTMLDivElement | null>;
}

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function usePageTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error('usePageTransition must be used inside TransitionProvider');
  return ctx;
}

interface TransitionProviderProps {
  children: React.ReactNode;
}

export function TransitionProvider({ children }: TransitionProviderProps) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [transitioning, setTransitioning] = useState(false);

  const navigate = useCallback(
    (href: string) => {
      if (transitioning) return;
      const overlay = overlayRef.current;
      if (!overlay) { router.push(href); return; }

      setTransitioning(true);

      // Curtain sweeps in from bottom-right corner
      gsap.set(overlay, { scale: 0, opacity: 1, transformOrigin: 'bottom right' });

      gsap
        .timeline({
          onComplete: () => {
            router.push(href);
            // After route change settle, sweep out to top-left
            gsap.delayedCall(0.15, () => {
              gsap.set(overlay, { transformOrigin: 'top left' });
              gsap.to(overlay, {
                scale: 0,
                duration: 0.55,
                ease: 'power3.in',
                onComplete: () => setTransitioning(false),
              });
            });
          },
        })
        .to(overlay, {
          scale: 1,
          duration: 0.5,
          ease: 'power3.out',
        });
    },
    [router, transitioning],
  );

  return (
    <TransitionContext.Provider value={{ navigate, overlayRef }}>
      {children}
      {/* Full-screen transition curtain */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        style={{ transform: 'scale(0)', transformOrigin: 'bottom right' }}
        className="fixed inset-0 z-[9999] pointer-events-none bg-[#0d0d1a] flex items-center justify-center"
      >
        <div className="flex gap-3 items-center">
          <span className="text-purple-400 text-3xl animate-pulse">✦</span>
          <span className="text-gray-500 text-sm tracking-widest uppercase font-medium">Loading</span>
          <span className="text-purple-400 text-3xl animate-pulse">✦</span>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
