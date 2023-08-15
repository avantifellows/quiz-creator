export default function Stepper({
  steps,
  activeStep,
}: {
  steps: string[];
  activeStep: string;
}) {
  return (
    <ol className="flex items-center justify-center w-full space-x-10 md:space-x-32 mt-16">
      {steps.map((step, index) => (
        <li
          key={index}
          className={`flex items-center ${
            step === activeStep ? "text-black" : "text-gray-400"
          } space-x-2.5 `}
        >
          <span
            className={`flex items-center justify-center w-[20px] h-[20px] text-[10px] sm:w-[35px] sm:h-[35px] sm:text-[20px] border rounded-full ${
              step === activeStep ? "text-white bg-[#A82929]" : ""
            } shadow-md`}
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
  );
}
