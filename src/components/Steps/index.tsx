'use client';

import { StepperFormProvider } from '@/hooks/useStepperForm';
import { Session, Steps } from '@/types';
import Stepper from '../Stepper';
import StudentDetails from './StudentDetails';
import TestDetails from './TestDetails';
import TimelineDetails from './Timeline';

interface StepsControllerProps {
  activeStep: Steps;
  sessionData: Session | {};
}
const StepForms = {
  [Steps.STUDENT]: StudentDetails,
  [Steps.TEST]: TestDetails,
  [Steps.TIMELINE]: TimelineDetails,
};

const StepsController = ({ activeStep, sessionData }: StepsControllerProps) => {
  const DynamicForm = StepForms[activeStep];

  return (
    <>
      <Stepper steps={Object.values(Steps)} activeStep={activeStep} />
      <StepperFormProvider sessionData={sessionData}>
        <DynamicForm />
      </StepperFormProvider>
    </>
  );
};

export default StepsController;
