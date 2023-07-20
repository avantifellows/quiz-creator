import { useRouter } from "next/router";
import React from "react";

export default function TestDetails({ setActiveStep }) {
  return (
    <>
      <div className="bg-white rounded-2 border border-solid border-[#B52326] m-10 rounded-lg">
        <form action="" className="flex flex-col items-center m-[60px]">
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5"
            placeholder="Test Name"
          />
          <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10">
            <option selected>Test Type</option>
          </select>
          <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10">
            <option selected>Test Format</option>
          </select>
          <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10">
            <option selected>Test Purpose</option>
          </select>
          <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10">
            <option selected>Platform</option>
          </select>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10"
            placeholder="Option Limit"
          />

          <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10">
            <option selected>Marking Scheme</option>
          </select>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10"
            placeholder="Test id"
          />
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10"
            placeholder="Test Session id"
          />
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10"
            placeholder="Test Session Link"
          />
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10"
            placeholder="CMS Test id"
          />
          <div className="w-full flex justify-between">
            <button
              className="rounded-lg sm:w-44 text-xs w-10 h-8 bg-[#B52326] text-white sm:h-11 mt-10"
              onClick={() => {
                setActiveStep("StudentDetails");
              }}
            >
              Back
            </button>
            <button
              className="rounded-lg sm:w-44 text-xs w-10 h-8 bg-[#B52326] text-white sm:h-11 mt-10"
              onClick={() => {
                setActiveStep("Timeline");
              }}
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
