import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FormDataProvider } from '@/hooks/useFormData';
import { Session, Steps } from '@/types';
import { memo } from 'react';
import Stepper from '../../../../components/ui/stepper';
import StudentDetails from './StudentDetails';
import TestDetails from './TestDetails';
import TimelineDetails from './Timeline';

interface StepsControllerProps {
  activeStep: Steps;
  sessionData: Session | {};
}
const StepForms = {
  [Steps.BASIC]: StudentDetails,
  [Steps.PLATFORM]: TestDetails,
  [Steps.TIMELINE]: TimelineDetails,
};

const StepsController = ({ activeStep, sessionData }: StepsControllerProps) => {
  const DynamicForm = StepForms[activeStep];

  return (
    <>
      <Stepper steps={Object.values(Steps)} activeStep={activeStep} />
      <Card className="my-5 mx-auto w-11/12 md:w-2/3 lg:w-1/2">
        <CardHeader />
        <CardContent>
          <FormDataProvider sessionData={sessionData}>
            <DynamicForm />
          </FormDataProvider>
        </CardContent>
      </Card>
    </>
  );
};

export default memo(StepsController);
