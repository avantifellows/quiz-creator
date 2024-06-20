import '@/app/globals.css';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="w-full min-h-screen">
        <Navbar />
        <main className="mx-4 my-8 md:mx-8">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: 'Quiz creator',
  description: 'Quiz creator',
};
