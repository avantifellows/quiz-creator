import CreateSession from '@/components/Buttons/CreateSession'
import React from 'react'

export default function sessionInfo() {
  return<>
  <div className='flex justify-between m-2 '>
  <CreateSession/>
  <input type="text" placeholder='Search by CMS_id or Test_name' className=' rounded-[10px] border-black border-solid border text-xs md:text-md '/>
  </div>
  </>
}
