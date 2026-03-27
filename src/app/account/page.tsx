import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-cinzel font-bold">Your Adventures</h1>
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Back to Library
          </Link>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-700">
          {session.user.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt={session.user.name ?? 'User avatar'}
              className="w-12 h-12 rounded-full"
            />
          )}
          <div>
            <p className="font-semibold">{session.user.name ?? 'Anonymous Adventurer'}</p>
            <p className="text-sm text-gray-400">{session.user.email}</p>
          </div>
        </div>

        {/* TODO: Fetch and display player session history from the database */}
        <section className="space-y-4">
          <h2 className="text-xl font-cinzel font-semibold">Recent Sessions</h2>
          <div className="rounded-xl border border-gray-700 p-6 text-center text-gray-400">
            <p>Your adventure history will appear here once you start playing.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
