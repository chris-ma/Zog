'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NameInputScreen } from '@/components/ui/NameInputScreen';
import { usePlayer } from '@/context/PlayerContext';

interface StoryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function StoryDetailPage({ params }: StoryDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { hasName } = usePlayer();

  // If player already has a name stored, skip straight to play
  useEffect(() => {
    if (hasName) {
      router.push(`/story/${id}/play`);
    }
  }, [hasName, id, router]);

  if (hasName) return null;

  return (
    <NameInputScreen
      storyTitle="The Galaxy-Brained Burp Quest"
      onReady={() => router.push(`/story/${id}/play`)}
    />
  );
}
