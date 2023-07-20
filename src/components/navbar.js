import Image from "next/image";
import React from "react";

const Navbar = () => {
  return (
    <>
      <div>
        <div className="flex flex-row justify-between items-center md:px-5">
          <div className="relative w-32 aspect-video">
            <Image src="/logo_2 1.svg" alt="Avanti fellows logo" fill />
          </div>
          <p className={`md:text-2xl md:first-letter:text-3xl text-xs `}>
            SESSION MANAGER
          </p>
        </div>
        <div>
          <div className="flex  text-white text-l gap-5 pl-10 items-center bg-[#B52326] w-100%  h-16">
            <p className="hover:font-semibold active:font-light cursor-pointer ">
              Quizzing Engine
            </p>
            <p className="hover:font-semibold active:font-light cursor-pointer ">
              Live Classes
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
