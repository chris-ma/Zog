import { EndingScreen } from '@/components/endings/EndingScreen';

interface EndingPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string; nodeId?: string; session?: string; histKey?: string }>;
}

export default async function EndingPage({ params, searchParams }: EndingPageProps) {
  const { id } = await params;
  const { type, nodeId, session, histKey } = await searchParams;

  return (
    <main className="min-h-screen">
      <EndingScreen
        storyId={id}
        endingType={type}
        nodeId={nodeId}
        sessionId={session}
        histKey={histKey}
      />
    </main>
  );
}
