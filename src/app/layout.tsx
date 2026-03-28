import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Providers } from '@/components/providers/Providers';

export const metadata: Metadata = {
  title: 'Choose Your Own Adventure',
  description: 'An interactive storytelling experience powered by AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Text:wght@400;600&family=Fredoka+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-foreground font-crimson antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
