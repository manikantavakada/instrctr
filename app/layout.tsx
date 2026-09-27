import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Instrctr — Driving confidence, one lesson at a time',
  description: 'Learn to drive with trusted local instructors. Instrctr is launching soon.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
