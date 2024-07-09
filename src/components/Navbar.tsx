'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: 'Quizzing Engine', path: '/' },
  {
    label: 'Live Classes',
    path: '/live',
  },
];

const Navbar = () => {
  const currentPath = usePathname();

  return (
    <header>
      <nav className="flex flex-row justify-between items-center px-4 md:px-8">
        <Link href="/" className="relative w-32 aspect-video" title="Avanti Fellows">
          <Image
            src="https://cdn.avantifellows.org/af_logos/avanti_logo_black_text.webp"
            alt="Avanti fellows logo"
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            fill
          />
        </Link>
        <h1 className="text-lg md:text-2xl">
          <span className="text-2xl md:text-3xl text-bold">S</span>ESSION{' '}
          <span className="text-2xl md:text-3xl text-bold">M</span>ANAGER
        </h1>
      </nav>
      <nav className="flex flex-row items-center gap-6 bg-primary text-primary-foreground w-full h-16 px-4 md:px-8">
        {NAV_LINKS.map((link) => (
          <Link
            href={link.path}
            key={link.label}
            className={`rounded-3xl px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/80 hover:text-accent-foreground ${currentPath === link.path ? 'bg-accent text-accent-foreground' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Navbar;
