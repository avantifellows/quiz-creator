import Stepper from "@/components/Stepper";
import TestDetails from "@/components/Steps/TestDetails";
import Timeline from "@/components/Steps/Timeline";
import StudentDetails from "@/components/Steps/StudentDetails";

import React, { useState } from "react";
const Step = {
  STUDENT_DETAILS: "StudentDetails",
  TEST_DETAILS: "TestDetails",
  TIMELINE: "Timeline",
};

//Renders the main page for the multiple sub-pages that are rendered after
export default function SessionCreator() {
  const [activeStep, setActiveStep] = useState(Step.STUDENT_DETAILS);

  const activeForm = () => {
    if (activeStep === Step.STUDENT_DETAILS) {
      return <StudentDetails setActiveStep={setActiveStep} />;
    } else if (activeStep === Step.TEST_DETAILS) {
      return <TestDetails setActiveStep={setActiveStep} />;
    } else {
      return <Timeline setActiveStep={setActiveStep} />;
    }
  };
  const steps = [Step.STUDENT_DETAILS, Step.TEST_DETAILS, Step.TIMELINE];
  return (
    <>
      <div className="md:flex md:justify-around mt-5 flex flex-col items-center md:flex-row text-xs md:text-lg">
        <div>Session Creator</div>
        <div>Created Date: 26-06-2023</div>
        <div>Created By: Arya Jain</div>
      </div>
      <Stepper steps={steps} activeStep={activeStep} />
      {activeForm()}
    </>
  );
}
