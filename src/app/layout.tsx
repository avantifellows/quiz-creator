import '@/app/globals.css';
import Navbar from '@/components/Navbar';
import { authOptions } from '@/lib/auth';
import { Toaster } from '@/components/ui/sonner';
import { getServerSession } from 'next-auth';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = process.env.APP_ENV === 'testing' ? null : await getServerSession(authOptions);
  const actorEmail =
    process.env.APP_ENV === 'testing' ? 'test@avantifellows.org' : session?.user?.email;

  return (
    <html lang='en'>
      <body className='w-full min-h-screen'>
        <Navbar actorEmail={actorEmail} />
        <main className='mx-4 my-8 md:mx-8'>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: 'Session Manager',
  description: 'Session Manager - Avanti Fellows',
};
