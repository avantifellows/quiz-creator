import React from "react";

export default function Timeline({ setActiveStep }) {
  return (
    <>
      <div className="bg-white rounded-2 border border-solid border-[#B52326] m-10 rounded-lg">
        <form action="" className="flex flex-col items-center m-[60px]">
          <div>
            <div className="flex mb-5 space-x-5">
              <p>Start Date</p>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 "
                placeholder="Start Date"
                type="date"
              />
              <p>End Date</p>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5"
                placeholder="End Date"
                type="date"
              />
            </div>
          </div>

          <div className="flex mb-5 space-x-5">
            <p>Start Time</p>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5"
              placeholder="Start Time"
              type="time"
            />
            <p>End Time</p>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5"
              placeholder="End Time"
              type="time"
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
            <button
              className="rounded-lg sm:w-44 w-10 text-xs h-8 bg-[#B52326] text-white sm:h-11 mt-10"
              onClick={() => {
                setActiveStep(1);
              }}
            >
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
