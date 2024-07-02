'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Stepper from '@/components/ui/stepper';
import { FormDataProvider } from '@/hooks/useFormContext';
import { ApiFormOptions, Session, StepperSteps, Steps } from '@/types';
import { useSearchParams } from 'next/navigation';
import { memo, useMemo } from 'react';
import Basic from './Basic';
import Platform from './Platform';
import Timeline from './Timeline';

interface StepsControllerProps {
  sessionData: Session;
  options: ApiFormOptions;
}

const StepForms: StepperSteps = {
  [Steps.BASIC]: { component: Basic, label: 'Basic Details' },
  [Steps.PLATFORM]: { component: Platform, label: 'Platform Details' },
  [Steps.TIMELINE]: { component: Timeline, label: 'Timeline Details' },
};

const StepsController = ({ sessionData, options }: StepsControllerProps) => {
  const searchParams = useSearchParams();
  const activeStep = (searchParams.get('step') as Steps) ?? Steps.BASIC;

  const DynamicForm = useMemo(() => StepForms[activeStep].component ?? null, [activeStep]);

  return (
    <main className="md:container mx-auto">
      <Stepper steps={StepForms} activeStep={activeStep} />
      <Card className="my-5">
        <CardHeader />
        <CardContent>
          <FormDataProvider sessionData={sessionData} options={options}>
            <DynamicForm />
          </FormDataProvider>
        </CardContent>
      </Card>
    </main>
  );
};

export default memo(StepsController);
