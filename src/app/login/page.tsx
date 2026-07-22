'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  return (
    <main className='mx-auto mt-24 flex max-w-md flex-col items-center gap-6 rounded-lg border p-8 text-center shadow-sm'>
      <div>
        <h1 className='text-2xl font-semibold'>Session Manager</h1>
        <p className='mt-2 text-sm text-muted-foreground'>
          Sign in with your Avanti Fellows Google account.
        </p>
      </div>
      <Button className='w-full' onClick={() => signIn('google', { callbackUrl: '/' })}>
        Sign in with Google
      </Button>
    </main>
  );
}
