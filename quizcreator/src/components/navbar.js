import Image from 'next/image';
import React from 'react'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

const Navbar = ()=> {
  return (
 <>
 <div className=''>
  <div className='flex flex-row justify-between'>
      <Image
      src="/logo_2 1.svg"
      alt='Avanti fellows logo'
      width={100}
      height={90.95}
      />
      <p className={`${inter.className} text-[10px] font-semibold`}>SESSION MANAGER</p>
     </div>
     <div className='bg-[#B52326]'>
     <div className= 'flex  text-white text-xs justify-around'>
     <p className='hover: font-semibold active:font-light '>Quizzing Engine</p>
     <p className='hover: font-semibold active:font-light '>Live Classes</p>
     </div>
     </div>
 </div>
 </>
  )
}

export default Navbar;