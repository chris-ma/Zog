'use client';

import { useState, useEffect, useCallback } from 'react';

interface NarrateButtonProps {
  text: string;
}

export function NarrateButton({ text }: NarrateButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  // Stop speech when text changes (new scene loaded)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [text]);

  // Stop on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggle = useCallback(() => {
    if (!supported) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Strip {PLAYER_NAME} substitutions are already done upstream; just clean markdown-ish chars
    const cleanText = text.replace(/[✦★]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.92;
    utterance.pitch = 1.05;

    // Prefer a warm English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Daniel') ||
          v.name.includes('Google UK') ||
          v.name.includes('Samantha') ||
          v.name.includes('Karen')),
    );
    if (preferred) utterance.voice = preferred;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, [supported, isSpeaking, text]);

  if (!supported) return null;

  return (
    <button
      onClick={handleToggle}
      aria-label={isSpeaking ? 'Stop narration' : 'Narrate scene'}
      title={isSpeaking ? 'Stop narration' : 'Narrate scene'}
      className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors font-medium ${
        isSpeaking
          ? 'bg-purple-600/30 border-purple-500/70 text-purple-200 hover:bg-purple-600/50'
          : 'bg-transparent border-purple-700/40 text-purple-400 hover:border-purple-500 hover:text-purple-200'
      }`}
    >
      {isSpeaking ? (
        <>
          <SpeakerIcon animating />
          <span>Stop</span>
        </>
      ) : (
        <>
          <SpeakerIcon animating={false} />
          <span>Narrate</span>
        </>
      )}
    </button>
  );
}

function SpeakerIcon({ animating }: { animating: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={animating ? 'animate-pulse' : ''}
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      {animating ? (
        <>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </>
      ) : (
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      )}
    </svg>
  );
}
