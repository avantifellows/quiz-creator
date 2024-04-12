import Image from 'next/image';

const NAV_LINKS = [{ label: 'Quizzing Engine', path: '/' }];

// Renders Navbar as General Component
const Navbar = () => {
  return (
    <header>
      <nav className="flex flex-row justify-between items-center md:px-5">
        <div className="relative w-32 aspect-video">
          <Image
            src="/AvantiFellowsLogo_1.svg"
            alt="Avanti fellows logo"
            fill
          />
        </div>
        <p
          className={`md:text-2xl md:first-letter:text-3xl md:first-letter:text-bold text-xs `}
        >
          SESSION MANAGER
        </p>
      </nav>
      <nav>
        <div className="flex text-white text-l gap-5 pl-10 items-center bg-[#B52326] w-full h-16">
          {NAV_LINKS.map(({ label }) => (
            <p
              key={label}
              className="hover:font-semibold active:font-light cursor-pointer "
            >
              {label}
            </p>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
