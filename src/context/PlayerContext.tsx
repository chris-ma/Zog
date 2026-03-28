'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'cyoa_player_name';

interface PlayerContextValue {
  playerName: string;
  setPlayerName: (name: string) => void;
  hasName: boolean;
}

const PlayerContext = createContext<PlayerContextValue>({
  playerName: '',
  setPlayerName: () => {},
  hasName: false,
});

export function PlayerContextProvider({ children }: { children: React.ReactNode }) {
  const [playerName, setPlayerNameState] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setPlayerNameState(stored);
  }, []);

  const setPlayerName = useCallback((name: string) => {
    setPlayerNameState(name);
    localStorage.setItem(STORAGE_KEY, name);
  }, []);

  return (
    <PlayerContext.Provider value={{ playerName, setPlayerName, hasName: playerName.trim().length > 0 }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}

/** Replace {PLAYER_NAME} tokens in prose with the actual player name. */
export function injectPlayerName(text: string, playerName: string): string {
  if (!playerName.trim()) return text.replace(/\{PLAYER_NAME\}/g, 'the hero');
  return text.replace(/\{PLAYER_NAME\}/g, playerName.trim());
}
