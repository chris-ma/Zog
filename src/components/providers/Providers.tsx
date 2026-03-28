'use client';

import { SessionProvider } from 'next-auth/react';
import { PlayerContextProvider } from '@/context/PlayerContext';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <PlayerContextProvider>{children}</PlayerContextProvider>
    </SessionProvider>
  );
}
