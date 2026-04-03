'use client';

import { SessionProvider } from 'next-auth/react';
import { PlayerContextProvider } from '@/context/PlayerContext';
import { TransitionProvider } from '@/context/TransitionContext';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <PlayerContextProvider>
        <TransitionProvider>{children}</TransitionProvider>
      </PlayerContextProvider>
    </SessionProvider>
  );
}
