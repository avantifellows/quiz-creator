import { useStepperForm } from '@/hooks/useStepperForm';
import { SessionParams } from '@/types';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
// import { Step } from '@/app/session/[type]/page';
// import { ActiveFormProps } from '@/types';
// import { QuizCreatorForm } from '@/types/form.types';
// import { useEffect, useState } from 'react';
// import { SubmitHandler, useForm } from 'react-hook-form';
// import {
//   HasSyncedOptions,
//   IsEnabledOptions,
//   SessionTypeOptions,
// } from '../../Constants/TimelineOptions';
// import { Success } from '../Modal/Success';
// import SelectField from './Form/SelectField';

// export default function Timeline({
//   data,
//   setActiveStep,
//   setData,
//   OnSubmitSession,
//   isSessionAdded,
//   type,
// }: ActiveFormProps) {
//   const [shouldSubmit, setShouldSubmit] = useState(false);

//   const { register, handleSubmit, control, reset } = useForm<QuizCreatorForm>({
//     defaultValues: { ...data.timeline },
//   });

//   useEffect(() => {
//     shouldSubmit && OnSubmitSession!();

//     reset();
//   }, [shouldSubmit, data]);

//   const onSubmit: SubmitHandler<QuizCreatorForm> = (timeline) => {
//     setData((prevData) => ({ ...prevData, timeline }));

//     setShouldSubmit(true);
//   };

//   return (
//     <div className="bg-white rounded-2  border border-solid border-[#B52326] sm:m-10 m-5 rounded-lg">
//       <form
//         className="flex flex-col items-center m-[60px]"
//         onSubmit={handleSubmit(onSubmit)}
//       >
//         <div>
//           <div className="flex sm:mb-5 sm:space-x-5 mb-3 space-x-1 flex-col sm:flex-row space-y-3 sm:space-y-0">
//             <label className="text-xs sm:text-sm ">Start Date</label>
//             <input
//               className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded sm:w-full sm:p-2.5 w-20"
//               placeholder="Start Date"
//               type="date"
//               required
//               {...register('startDate')}
//             />
//             <label className="text-xs sm:text-sm">End Date</label>
//             <input
//               className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded  sm:w-full sm:p-2.5  w-20"
//               placeholder="End Date"
//               type="date"
//               required
//               {...register('endDate')}
//             />
//           </div>
//         </div>
//         <div className="flex sm:mb-5 sm:space-x-5 space-x-1 mt-3 flex-col md:flex-row space-y-3 sm:space-y-0">
//           <p className="text-xs sm:text-sm">Start Time</p>
//           <input
//             className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded block sm:w-full sm:p-2.5"
//             placeholder="Start Time"
//             type="time"
//             required
//             {...register('startTime')}
//           />
//           <p className="text-xs sm:text-sm">End Time</p>
//           <input
//             className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded block sm:w-full sm:p-2.5"
//             placeholder="End Time"
//             type="time"
//             required
//             {...register('endTime')}
//           />
//         </div>
//         <div className="flex md:w-full md:justify-start m-1 ">
//           <label className="text-gray-400 text-md  ">Enabled</label>
//         </div>
//         <SelectField
//           control={control}
//           name_="isEnabled"
//           options={IsEnabledOptions}
//         />
//         <div className="flex md:w-full md:justify-start m-1 ">
//           <label className="text-gray-400 text-md  ">Session Type</label>
//         </div>
//         <SelectField
//           control={control}
//           name_="infinite_session"
//           options={SessionTypeOptions}
//         />
//         {data.timeline.id ? (
//           <>
//             <SelectField
//               control={control}
//               name_="has_synced_to_bq"
//               options={HasSyncedOptions}
//             />

//             <input
//               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10"
//               placeholder="Repeat Schedule"
//               required
//               {...register('repeatSchedule')}
//             />
//             <input
//               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10"
//               placeholder="Report Link"
//               required
//               {...register('reportLink')}
//             />
//           </>
//         ) : (
//           <></>
//         )}
//         <div className="w-full flex justify-between">
//           <button
//             className="rounded-lg sm:w-44 w-10 text-xs h-8 bg-[#B52326] text-white sm:h-11 mt-10"
//             onClick={() => {
//               setActiveStep(Step.TEST_DETAILS);
//             }}
//           >
//             Back
//           </button>
//           <button
//             type="submit"
//             className="rounded-lg sm:w-44 text-xs w-10 h-8 bg-[#B52326] text-white sm:h-11 mt-10"
//           >
//             Save
//           </button>
//         </div>
//       </form>
//       <Success type={type} show={isSessionAdded} />
//     </div>
//   );
// }

const TimelineDetails = () => {
  const params = useParams<SessionParams>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { formData, addFormData, submitForm } = useStepperForm();

  const handleNext = useCallback(() => {
    addFormData({ timeline: { data: 'cdscdsc' } });
    const id = searchParams.get('id');
    submitForm();
  }, []);

  return (
    <main>
      <h2>Timeline</h2>
      <button onClick={handleNext}>Submit</button>
    </main>
  );
};

export default TimelineDetails;
