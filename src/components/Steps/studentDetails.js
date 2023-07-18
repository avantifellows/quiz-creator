import { useRouter } from "next/router";
import React from "react";

export default function StudentDetails({ setActiveStep }) {
  return (
    <>
      <div className="bg-white rounded-2 border border-solid border-[#B52326] m-10 rounded-lg">
        <form action="" className="flex flex-col items-center m-[60px]">
          <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5">
            <option selected>Program</option>
            <option value="Haryana Students">Haryana Students</option>
            <option value="Himachal Students">Himachal Students</option>
            <option value="Delhi Students">Delhi Students"</option>
            <option value="Enable Students">Enable Students"</option>
            <option value="AF Teachers">AF Teachers</option>
            <option value="Candidates">Candidates</option>
            <option value="Gujarat Students">Gujarat Students</option>
            <option value="AF Testing">AF Testing</option>
          </select>
          <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10">
            <option selected>Batch</option>
          </select>
          <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10">
            <option selected>Grade</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </select>
          <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10">
            <option selected>Course</option>
            <option value="NEET">NEET</option>
            <option value="Catalyst">Catalyst</option>
            <option value="Alpha">Alpha</option>
            <option value="Hiring">Hiring</option>
            <option value="Certification">Certification</option>
            <option value="Foundation">Foundation</option>
            <option value="Photon">Photon</option>
          </select>
          <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10">
            <option selected>Stream</option>
            <option value="Medical">Medical</option>
            <option value="Maths">Maths</option>
            <option value="Science">Science</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="PCMB">PCMB</option>
            <option value="Botany">Botany</option>
            <option value="PCMBA">PCMBA</option>
            <option value="Zoology">Zoology</option>
          </select>
          <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10">
            <option selected>Test Takers Count</option>
          </select>

          <button
            className="rounded-lg md:w-44 w-32 bg-[#B52326] text-white h-11 mt-10 "
            onClick={() => {
              setActiveStep(1);
            }}
          >
            Next
          </button>
        </form>
      </div>
    </>
  );
}
