// Stepper.js
import { Step } from "@/pages/SessionCreator";
import React from "react";

//Navigates throught different sub-pages by passing the current step and the active step and renders the components based on the sub-page user is presented at
export default function Stepper({
  steps,
  activeStep,
}: {
  steps: Step[];
  activeStep: string;
}) {
  return (
    <>
      <ol className="sm:items-center sm:justify-center w-full space-x-10 flex md:space-x-32 mt-16">
        {steps.map((step, index) => (
          <li
            key={index}
            className={`flex items-center ${
              step === activeStep ? "text-black" : "text-gray-400"
            } space-x-2.5 `}
          >
            <span
              className={`flex items-center text-[10px] justify-center w-[20px] h-[20px] sm:w-[35px] sm:h-[35px] sm:text-[20px] border rounded-full shrink-0 ${
                step === activeStep ? "text-white bg-[#A82929]" : ""
              } drop-shadow-[0px_4px_4px_rgba(0, 0, 0, 0.25)]`}
            >
              {index + 1}
            </span>
            <span>
              <h3 className="font-medium leading-tight text-[12px] sm:text-[20px]">
                {step}
              </h3>
            </span>
          </li>
        ))}
      </ol>
    </>
  );
}
