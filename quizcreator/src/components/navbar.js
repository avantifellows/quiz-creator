import Image from 'next/image';
import React from 'react'
import styles from '@/styles/Home.module.css'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

const Navbar = ()=> {
  return (
 <>
  <div className={styles.Header}>
      <Image
      src="/logo_2 1.svg"
      alt='Avanti fellows logo'
      width={220}
      height={90.95}
      />
      <p className={`${inter.className}`}>SESSION MANAGER</p>
     </div>
     <div className={styles.Navbar}>
     <p>Quizzing Engine</p>
     <p>Live Classes</p>
     </div>
 </>
  )
}

export default Navbar;