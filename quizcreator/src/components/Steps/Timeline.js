import React from "react";

export default function Timeline({setActiveStep}) {
  return (
    <>
  

      <div className="bg-white rounded-2 border border-solid border-[#B52326] m-10 rounded-lg">
        <form action="" className="flex flex-col items-center m-[60px]">
          <div>
            <div className="flex">
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 "
                placeholder="Start Date"
                type="text"
                onfocus="(this.type='date')"
              />
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5"
                placeholder="End Date"
                type="text"
                onfocus="(this.type='date')"
              />
            </div>
          </div>

          <div className="flex">
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5"
              placeholder="Start Time"
              type="text"
              onfocus="(this.type='date')"
            />
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5"
              placeholder="End Time"
              type="text"
              onfocus="(this.type='date')"
            />
          </div>
          <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10">
            <option selected>is Enable</option>
          </select>
          <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10">
            <option selected>Infinite Session</option>
          </select>
          <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10">
            <option selected>has_synced</option>
          </select>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10"
            placeholder="Report Schedule"
          />
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10"
            placeholder="Report Link"
          />

          <div className="w-full flex justify-between">
            <button className="rounded-lg sm:w-44 w-10 text-xs h-8 bg-[#B52326] text-white sm:h-11 mt-10"  onClick={()=>{
  setActiveStep(1)
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
