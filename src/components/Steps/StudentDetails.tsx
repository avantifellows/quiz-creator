// import { Step } from '@/app/session/[type]/page';
// import styles from '@/styles/Home.module.css';
// import { ActiveFormProps } from '@/types';
// import { QuizCreatorForm } from '@/types/form.types';
// import { SubmitHandler, useForm } from 'react-hook-form';
// import {
//   BatchOptions,
//   CourseOptions,
//   GradeOptions,
//   ProgramOptions,
//   StreamOptions,
// } from '../../Constants/StudentDetailsOptions';
// import SelectField from './Form/SelectField';

import { useStepperForm } from '@/hooks/useStepperForm';
import { SessionParams, Steps } from '@/types';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

// export default function StudentDetails({
//   data,
//   setActiveStep,
//   setData,
//   type,
// }: ActiveFormProps) {
//   const { register, handleSubmit, control } = useForm<QuizCreatorForm>({
//     defaultValues: { ...data.student },
//   });

//   const onSubmit: SubmitHandler<QuizCreatorForm> = (student) => {
//     setData((prevData) => ({ ...prevData, student }));

//     setActiveStep(Step.TEST_DETAILS);
//   };

//   return (
//     <div className="bg-white rounded-2 border border-solid border-[#B52326] sm:m-10 m-5 rounded-lg">
//       <form
//         className="flex flex-col items-center m-[60px]"
//         onSubmit={handleSubmit(onSubmit)}
//       >
//         <div className="flex md:w-full md:justify-start md:ml-1 ">
//           <label htmlFor="program" className="text-gray-400 text-md mt-2 ">
//             Program
//           </label>
//         </div>
//         <SelectField
//           control={control}
//           isDisabled={type === 'edit' ? true : false}
//           name_="program"
//           options={ProgramOptions}
//         />
//         <div className="flex md:w-full md:justify-start ">
//           <label htmlFor="program" className="text-gray-400 text-md mt-2   ">
//             Batch
//           </label>
//         </div>
//         <SelectField control={control} name_="batch" options={BatchOptions} />
//         <div className="flex md:w-full md:justify-start  ">
//           <label htmlFor="program" className="text-gray-400 text-md  mt-2  ">
//             Grade
//           </label>
//         </div>
//         <SelectField control={control} name_="grade" options={GradeOptions} />
//         <div className="flex md:w-full justify-start ">
//           <label htmlFor="program" className="text-gray-400 text-md mt-2">
//             Course
//           </label>
//         </div>
//         <SelectField control={control} name_="course" options={CourseOptions} />
//         <div className="flex md:w-full justify-start ">
//           <label htmlFor="program" className="text-gray-400 text-md mt-2">
//             Stream
//           </label>
//         </div>
//         <SelectField control={control} name_="stream" options={StreamOptions} />
//         <div className="flex md:w-full justify-start ">
//           <label htmlFor="program" className="text-gray-400 text-md mt-2">
//             Test Takers Count
//           </label>
//         </div>
//         <input
//           className={styles.custom_input}
//           required
//           type="number"
//           {...register('testTakers')}
//           placeholder="Test Taker Count"
//         />

//         <button
//           type="submit"
//           className="rounded-lg md:w-44 w-32 bg-[#B52326] text-white h-11 mt-10"
//         >
//           Next
//         </button>
//       </form>
//     </div>
//   );
// }

const StudentDetails = () => {
  const params = useParams<SessionParams>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { formData, addFormData } = useStepperForm();

  const handleNext = useCallback(() => {
    addFormData({ student: { abc: 'xyx' } });
    const id = searchParams.get('id');
    router.push(`/session/${params.type}?step=${Steps.TEST}&id=${id}`);
  }, []);

  return (
    <main>
      <h2>StudentDetails</h2>
      <button onClick={handleNext}>Next</button>
    </main>
  );
};

export default StudentDetails;
