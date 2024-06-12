import Image from 'next/image';
import Link from 'next/link';

const NAV_LINKS = [{ label: 'Quizzing Engine', path: '/' }];

const Navbar = () => {
  return (
    <header>
      <nav className="flex flex-row justify-between items-center px-8">
        <Link href="/" className="relative w-32 aspect-video" title="Avanti Fellows">
          <Image src="/AvantiFellowsLogo_1.svg" alt="Avanti fellows logo" fill priority />
        </Link>
        <h1 className="text-lg md:text-2xl">
          <span className="text-2xl md:text-3xl text-bold">S</span>ESSION{' '}
          <span className="text-2xl md:text-3xl text-bold">M</span>ANAGER
        </h1>
      </nav>
      <nav className="flex flex-row items-center bg-primary text-primary-foreground w-full h-16 px-8">
        {NAV_LINKS.map((link) => (
          <Link href={link.path} key={link.label} className="font-medium hover:font-semibold">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Navbar;
