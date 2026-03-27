import { EndingScreen } from '@/components/endings/EndingScreen';

interface EndingPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string; session?: string }>;
}

export default async function EndingPage({ params, searchParams }: EndingPageProps) {
  const { id } = await params;
  const { type, session } = await searchParams;

  return (
    <main className="min-h-screen">
      <EndingScreen storyId={id} endingType={type} sessionId={session} />
    </main>
  );
}
