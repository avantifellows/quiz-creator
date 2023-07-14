import React from "react";

export default function Timeline() {
  return (
    <>
       <ol className="sm:items-center sm:justify-center w-full space-x-10 flex md:space-x-32 mt-16">
    
    <li className="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5">
        <span className="flex items-center justify-center text-[10px] w-[20px] h-[20px] sm:w-[35px] sm:h-[35px] sm:text-[20px]  border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
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
            <h3 className="font-medium leading-tight text-[12px] sm:text-[20px]">Test Details</h3>
        </span>
    </li>
    <li className="flex items-center text-black space-x-2.5">
        <span className="flex items-center text-[10px] justify-center w-[20px] h-[20px] sm:w-[35px] sm:h-[35px] sm:text-[20px] border rounded-full shrink-0 text-white bg-[#A82929] drop-shadow-[0px_4px_4px_rgba(0, 0, 0, 0.25)]">
            3
        </span>
        <span>  
            <h3 className="font-medium leading-tight text-[12px] sm:text-[20px">Timeline</h3>
        </span>
    </li>
</ol>

      <div className="bg-white rounded-2 border border-solid border-[#B52326] m-10 rounded-lg">
        <form action="" className="flex flex-col items-center m-[60px]">
          <div>
            <div className="flex">
              <input
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 "
                placeholder="Start Date"
                type="text"
                onfocus="(this.type='date')"
              />
              <input
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5"
                placeholder="End Date"
                type="text"
                onfocus="(this.type='date')"
              />
            </div>
          </div>

          <div className="flex">
            <input
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5"
              placeholder="Start Time"
              type="text"
              onfocus="(this.type='date')"
            />
            <input
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5"
              placeholder="End Time"
              type="text"
              onfocus="(this.type='date')"
            />
          </div>
          <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10">
            <option selected>is Enable</option>
          </select>
          <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10">
            <option selected>Infinite Session</option>
          </select>
          <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10">
            <option selected>has_synced</option>
          </select>
          <input
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10"
            placeholder="Report Schedule"
          />
          <input
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10"
            placeholder="Report Link"
          />

          <div className="w-full flex justify-between">
            <button className="rounded-lg sm:w-44 w-10 text-xs h-8 bg-[#B52326] text-white sm:h-11 mt-10"  onClick={()=>{
      router.push('/TestDetails')
    }}>
              Back
            </button>
            <button className="rounded-lg sm:w-44 text-xs w-10 h-8 bg-[#B52326] text-white sm:h-11 mt-10">
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
