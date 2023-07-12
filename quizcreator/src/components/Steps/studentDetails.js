import React from 'react'

export default function StudentDetails() {
  return <>
   <div className='bg-white rounded-2 border border-solid border-[#B52326] m-10'>
<form action="" className='flex flex-col items-center m-[60px]' >   
<select  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5">
  <option selected>Program</option>
</select>
  <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10">
    <option selected>Batch</option>
    </select>
    <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10">
    <option selected>Grade</option>
    </select>
    <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10">
    <option selected>Course</option>
    </select>
    <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10">
    <option selected>Stream</option>
    </select>
    <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10">
    <option selected>Test Takers Count</option>
    </select>

    <button className='rounded-lg w-44 bg-[#B52326] text-white h-11 mt-10'>Next</button>
</form>

</div>
   </>
}
