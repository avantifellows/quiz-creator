import React from 'react'
import StudentDetails from './Steps/studentDetails'

export default function Stepper() {
  return <>

<ol className="sm:items-center sm:justify-center w-full space-x-10 flex md:space-x-32 mt-16">
    
    <li className="flex items-center text-black space-x-2.5 ">
        <span className="flex items-center text-[10px] justify-center w-[20px] h-[20px] sm:w-[35px] sm:h-[35px] sm:text-[20px] border rounded-full shrink-0 text-white bg-[#A82929] drop-shadow-[0px_4px_4px_rgba(0, 0, 0, 0.25)]">
            1
        </span>
        <span>
            <h3 className="font-medium leading-tight text-[12px] sm:text-[20px]">Student Details</h3>
        </span>
    </li>    
    <li className="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5">
        <span className="flex items-center justify-center text-[10px] w-[20px] h-[20px] sm:w-[35px] sm:h-[35px] sm:text-[20px]  border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
            2
        </span>
        <span>
            <h3 className="font-medium leading-tight text-[12px] sm:text-[20px">Test Details</h3>
        </span>
    </li>
    <li className="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5">
        <span className="flex items-center justify-center text-[10px] w-[20px] h-[20px] sm:w-[35px] sm:h-[35px] sm:text-[20px]  border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
            3
        </span>
        <span>  
            <h3 className="font-medium leading-tight text-[12px] sm:text-[20px">Timeline</h3>
        </span>
    </li>
</ol>

<StudentDetails/>
  </>
}
