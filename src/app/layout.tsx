import '@/app/globals.css';
import Navbar from '@/components/Navbar';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="w-full min-h-screen">
        <Navbar />
        <main className="m-8">{children}</main>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: 'Quiz creator',
  description: 'Quiz creator',
};
