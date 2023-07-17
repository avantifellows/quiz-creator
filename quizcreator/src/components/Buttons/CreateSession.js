import React from 'react'
import styles from '@/styles/Home.module.css'
import { useRouter } from 'next/router'

export default function CreateSession() {
  const router = useRouter();
  return (
   <button className='bg-[#B52326] text-white text-[10px] px-2 md:px-5 rounded-md md:text-[20px] ' onClick={()=>{
    router.push('/sessionCreator')
   }}>+ Create Session</button>
  )
}
