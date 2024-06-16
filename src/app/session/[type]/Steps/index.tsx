import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FormDataProvider } from '@/hooks/useFormContext';
import { Session, StepperSteps, Steps } from '@/types';
import { memo } from 'react';
import Stepper from '../../../../components/ui/stepper';
import Basic from './Basic';
import Platform from './Platform';
import Timeline from './Timeline';

interface StepsControllerProps {
  activeStep: Steps;
  sessionData: Session;
}

const StepForms: StepperSteps = {
  [Steps.BASIC]: { component: Basic, label: 'Basic Details' },
  [Steps.PLATFORM]: { component: Platform, label: 'Platform Details' },
  [Steps.TIMELINE]: { component: Timeline, label: 'Timeline Details' },
};

const StepsController = ({ activeStep, sessionData }: StepsControllerProps) => {
  const DynamicForm = StepForms[activeStep].component ?? null;

  return (
    <main className="md:container mx-auto">
      <Stepper steps={StepForms} activeStep={activeStep} />
      <Card className="my-5">
        <CardHeader />
        <CardContent>
          <FormDataProvider sessionData={sessionData}>
            <DynamicForm />
          </FormDataProvider>
        </CardContent>
      </Card>
    </main>
  );
};

export default memo(StepsController);
