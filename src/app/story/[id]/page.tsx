import Link from 'next/link';

interface StoryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function StoryDetailPage({ params }: StoryDetailPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <h1 className="text-4xl font-cinzel font-bold">Begin Your Adventure</h1>
        <p className="text-lg font-crimson text-gray-400">Story ID: {id}</p>

        {/* TODO: Fetch and display story details from the database */}
        <div className="rounded-xl border border-gray-700 p-6 text-left space-y-4">
          <p className="text-gray-300">
            Story details will be loaded here once the database is connected.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-lg border border-gray-600 hover:border-gray-400 transition-colors"
          >
            Back to Library
          </Link>
          <Link
            href={`/story/${id}/play`}
            className="px-6 py-3 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity font-semibold"
          >
            Start Adventure
          </Link>
        </div>
      </div>
    </main>
  );
}
