import { SceneView } from '@/components/scene/SceneView';

interface PlayPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ node?: string; session?: string }>;
}

export default async function PlayPage({ params, searchParams }: PlayPageProps) {
  const { id } = await params;
  const { node, session } = await searchParams;

  return (
    <main className="min-h-screen">
      <SceneView storyId={id} initialNodeId={node} sessionId={session} />
    </main>
  );
}
