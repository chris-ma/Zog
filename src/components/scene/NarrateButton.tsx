'use client';

import { useState, useEffect, useCallback } from 'react';

interface VoiceProfile {
  rate: number;
  pitch: number;
  /** Voice name substrings to try in order */
  preferredVoices: string[];
}

const VOICE_PROFILES: Record<string, VoiceProfile> = {
  // Fun, high-energy animated storyteller for the kids burp adventure
  animated: {
    rate: 1.08,
    pitch: 1.45,
    preferredVoices: ['Google US English', 'Samantha', 'Zira', 'Google UK English Female', 'Karen', 'Veena'],
  },
  // Warm, measured narrator for everything else
  default: {
    rate: 0.92,
    pitch: 1.05,
    preferredVoices: ['Daniel', 'Google UK English Male', 'Samantha', 'Karen'],
  },
};

interface NarrateButtonProps {
  text: string;
  voiceProfile?: keyof typeof VOICE_PROFILES;
}

export function NarrateButton({ text, voiceProfile = 'default' }: NarrateButtonProps) {
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

    const profile = VOICE_PROFILES[voiceProfile];

    // Clean special chars; for animated profile add dramatic pauses via punctuation
    let cleanText = text.replace(/[✦★]/g, '').trim();
    if (voiceProfile === 'animated') {
      // Insert a brief pause after every sentence ending to add theatrical timing
      cleanText = cleanText.replace(/([.!?])\s+/g, '$1  ');
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = profile.rate;
    utterance.pitch = profile.pitch;

    const trySetVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return; // voices not loaded yet

      let chosen: SpeechSynthesisVoice | undefined;
      for (const name of profile.preferredVoices) {
        chosen = voices.find((v) => v.lang.startsWith('en') && v.name.includes(name));
        if (chosen) break;
      }
      // Fallback: any en-US voice
      if (!chosen) chosen = voices.find((v) => v.lang === 'en-US');
      if (chosen) utterance.voice = chosen;
    };

    trySetVoice();

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, [supported, isSpeaking, text, voiceProfile]);

  if (!supported) return null;

  const isAnimated = voiceProfile === 'animated';

  return (
    <button
      onClick={handleToggle}
      aria-label={isSpeaking ? 'Stop narration' : 'Narrate scene'}
      title={isSpeaking ? 'Stop narration' : 'Narrate scene'}
      className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
        isSpeaking
          ? isAnimated
            ? 'bg-yellow-500/20 border-yellow-400/70 text-yellow-200 hover:bg-yellow-500/30'
            : 'bg-purple-600/30 border-purple-500/70 text-purple-200 hover:bg-purple-600/50'
          : isAnimated
            ? 'bg-transparent border-yellow-500/40 text-yellow-400 hover:border-yellow-400 hover:text-yellow-200'
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
          <span>{isAnimated ? '🎙️ Narrate' : 'Narrate'}</span>
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
