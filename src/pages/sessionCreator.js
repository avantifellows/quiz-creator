import Stepper from "@/components/Stepper";
import TestDetails from "@/components/Steps/TestDetails";
import Timeline from "@/components/Steps/Timeline";
import StudentDetails from "@/components/Steps/studentDetails";

import React, { useState } from "react";

export default function sessionCreator() {
  const [activestep, setActiveStep] = useState(0);
  const activeForm = () => {
    if (activestep === 0) {
      return <StudentDetails setActiveStep={setActiveStep} />;
    } else if (activestep === 1) {
      return <TestDetails setActiveStep={setActiveStep} />;
    } else {
      return <Timeline setActiveStep={setActiveStep} />;
    }
  };
  return (
    <>
      <div className="md:flex md:justify-around mt-5 flex flex-col items-center md:flex-row text-xs md:text-lg">
        <div>Session Creator</div>
        <div>Created Date: 26-06-2023</div>
        <div>Created By : Arya jain</div>
      </div>
      <Stepper isactive={activestep} />
      {activeForm()}
    </>
  );
}
