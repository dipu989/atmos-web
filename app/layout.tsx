import type { Metadata } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import './globals.css';
import { Providers } from '@/app/providers';

const inter = Inter({ subsets: ['latin'] });

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  // optical sizing axis gives crisper rendering at large display sizes
  axes: ['opsz'],
})

export const metadata: Metadata = {
  title: 'Atmos — Know the carbon cost of every trip',
  description:
    'Atmos quietly tracks how you move — car, train, bike, walk — and turns it into a clear picture of your daily carbon footprint. No spreadsheets. No guesswork.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${fraunces.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
