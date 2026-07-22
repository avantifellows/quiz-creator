'use client';

import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { LogOut, Plus, UserRound } from 'lucide-react';
import { Button } from './ui/button';

const NAV_LINKS = [
  { label: 'Quizzing Engine', path: '/' },
  {
    label: 'Live Classes',
    path: '/live',
  },
];

const Navbar = ({ actorEmail }: { actorEmail?: string | null }) => {
  const currentPath = usePathname();

  return (
    <header className='border-b border-border/60 bg-background shadow-sm'>
      <div className='flex h-16 items-center px-4 md:px-8'>
        <Link href='/' className='flex items-center gap-4' title='Avanti Fellows'>
          <span className='relative block h-10 w-28 shrink-0'>
            <Image
              src='https://cdn.avantifellows.org/af_logos/avanti_logo_black_text.webp'
              alt='Avanti Fellows logo'
              className='object-contain'
              sizes='112px'
              priority
              fill
            />
          </span>
          <span className='h-7 w-px bg-border' aria-hidden='true' />
          <span className='text-sm font-semibold uppercase tracking-[0.16em] text-foreground/80 sm:text-base'>
            Session Manager
          </span>
        </Link>
      </div>
      {actorEmail && (
        <nav className='flex min-h-14 w-full items-center gap-1 bg-primary px-3 py-2 text-sm font-medium text-primary-foreground md:gap-2 md:px-8'>
          <div className='flex items-center gap-1 md:gap-2'>
            {NAV_LINKS.map((link) => {
              const isActive = currentPath === link.path;

              return (
                <Link
                  href={link.path}
                  key={link.label}
                  aria-current={isActive ? 'page' : undefined}
                  className={`rounded-full px-3 py-2 transition-colors md:px-4 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-white/85 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className='ml-auto flex items-center gap-2'>
            <Link
              className='inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-primary shadow-sm transition-colors hover:bg-white/90 md:px-4'
              href='/session/create?step=basic'
              aria-current={currentPath === '/session/create' ? 'page' : undefined}
            >
              <Plus className='size-4' aria-hidden='true' />
              <span className='hidden sm:inline'>Create Session</span>
              <span className='sm:hidden'>Create</span>
            </Link>

            <div className='hidden items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs text-white/90 lg:flex'>
              <UserRound className='size-4 shrink-0' aria-hidden='true' />
              <span className='max-w-56 truncate'>{actorEmail}</span>
            </div>

            <Button
              variant='ghost'
              size='sm'
              className='rounded-full border border-white/20 px-3 text-white hover:bg-white/10 hover:text-white'
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              <LogOut className='size-4 sm:mr-1.5' aria-hidden='true' />
              <span className='hidden sm:inline'>Sign out</span>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
