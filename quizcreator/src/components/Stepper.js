import React from 'react'
import StudentDetails from './Steps/studentDetails'

export default function Stepper() {
  return <>
<div>
<ol className="items-center justify-center w-full  flex space-x-32 mt-16">
    
    <li className="flex items-center text-black space-x-2.5 ">
        <span className="flex items-center justify-center w-[35px] h-[35px] border rounded-full shrink-0 text-white bg-[#A82929] drop-shadow-[0px_4px_4px_rgba(0, 0, 0, 0.25)]">
            1
        </span>
        <span>
            <h3 className="font-medium leading-tight">Student Details</h3>
        </span>
    </li>    
    <li className="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5">
        <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
            2
        </span>
        <span>
            <h3 className="font-medium leading-tight">Test Details</h3>
        </span>
    </li>
    <li className="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5">
        <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
            3
        </span>
        <span>  
            <h3 className="font-medium leading-tight">Timeline</h3>
        </span>
    </li>
</ol>
</div> 
<StudentDetails/>
  </>
}
