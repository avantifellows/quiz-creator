import { toTitleCase } from '@/lib/utils';

export default function Stepper({ steps, activeStep }: { steps: string[]; activeStep: string }) {
  return (
    <ol className="flex items-center justify-center w-full gap-10 md:gap-32">
      {steps.map((step, index) => (
        <li
          key={step}
          className={`flex items-center ${step === activeStep ? 'text-black' : 'text-gray-400'} space-x-2.5 `}
        >
          <span
            className={`flex items-center justify-center size-5 text-xs sm:size-8 sm:text-xl border rounded-full ${
              step === activeStep ? 'text-primary-foreground bg-primary' : ''
            } shadow-md`}
          >
            {index + 1}
          </span>
          <span>
            <h3 className="font-medium leading-tight text-[12px] sm:text-[20px]">
              {toTitleCase(`${step} Details`)}
            </h3>
          </span>
        </li>
      ))}
    </ol>
  );
}
