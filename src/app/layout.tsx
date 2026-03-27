import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Providers } from '@/components/providers/Providers';

export const metadata: Metadata = {
  title: 'Choose Your Own Adventure',
  description: 'An interactive storytelling experience powered by AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground font-crimson antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
