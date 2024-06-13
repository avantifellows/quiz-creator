import { StepperSteps } from '@/types';

export default function Stepper({
  steps,
  activeStep,
}: {
  steps: StepperSteps;
  activeStep: string;
}) {
  return (
    <ol className="flex w-full flex-wrap justify-between flex-row">
      {Object.keys(steps)
        .filter((step) => !steps[step].hide)
        .map((step, index) => {
          const { label } = steps[step];
          const isDone = index <= Object.keys(steps).indexOf(activeStep);
          return (
            <li
              key={label + index}
              className={`relative flex-1 ${isDone ? 'text-black' : 'text-gray-400'}`}
            >
              <div className="flex items-center flex-col justify-center gap-2">
                <p
                  className={`flex items-center justify-center size-5 text-xs sm:size-8 sm:text-xl border rounded-full ${
                    isDone ? 'text-primary-foreground bg-primary' : ''
                  } shadow-md`}
                >
                  {index + 1}
                </p>
                <h3 className="font-medium leading-tight text-xs sm:text-xl">{label}</h3>
              </div>
            </li>
          );
        })}
    </ol>
  );
}
