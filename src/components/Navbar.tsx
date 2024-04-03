import Image from "next/image";
import React from "react";

// Renders Navbar as General Component
const Navbar = ({ item1, item2 }: { item1: string; item2: string }) => {
  return (
    <>
      <div>
        <div className="flex flex-row justify-between items-center md:px-5">
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
        </div>
        <div>
          <div className="flex text-white text-l gap-5 pl-10 items-center bg-[#B52326] w-full h-16">
            <p className="hover:font-semibold active:font-light cursor-pointer ">
              {item1}
            </p>
            <p className="hover:font-semibold active:font-light cursor-pointer ">
              {item2}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
