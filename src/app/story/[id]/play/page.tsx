'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SceneView } from '@/components/scene/SceneView';
import { usePlayer } from '@/context/PlayerContext';

interface PlayPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ node?: string; session?: string }>;
}

export default function PlayPage({ params, searchParams }: PlayPageProps) {
  const { id } = use(params);
  const { node, session } = use(searchParams);
  const router = useRouter();
  const { hasName, playerName, setPlayerName } = usePlayer();

  useEffect(() => {
    if (!hasName) router.replace(`/story/${id}`);
  }, [hasName, id, router]);

  if (!hasName) return null;

  return (
    <div className="min-h-screen bg-[#0d0d1a] flex flex-col">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-[#0d0d1a]/90 backdrop-blur border-b border-white/5">
        <Link href="/" className="text-gray-500 hover:text-gray-300 transition-colors text-sm">
          ← Library
        </Link>
        <div className="text-center">
          <p className="text-xs text-purple-400 tracking-widest uppercase font-medium">Playing as</p>
          <p className="text-sm font-bold text-white leading-tight">{playerName}</p>
        </div>
        <button
          onClick={() => { setPlayerName(''); router.push(`/story/${id}`); }}
          className="text-gray-500 hover:text-gray-300 transition-colors text-sm"
        >
          Restart
        </button>
      </header>

      <SceneView storyId={id} initialNodeId={node} sessionId={session} />
    </div>
  );
}
