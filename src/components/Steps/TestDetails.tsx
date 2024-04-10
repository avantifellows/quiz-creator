import styles from '../../styles/Home.module.css';

import { Step } from '@/pages/Session';
import { QuizCreatorForm } from '@/types/FormTypes';
import { ActiveFormProps } from '@/types/types';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  MarkingSchemeOptions,
  OptionalLimitOptions,
  TestFormatOptions,
  TestPlatformOptions,
  TestPurposeOptions,
  TestTypeOptions,
} from '../../Constants/TestDetailsOptions';
import SelectField from './Form/SelectField';

// Renders sub-page containing test details

export function TestDetails({
  data,
  setActiveStep,
  setData,
  type,
}: ActiveFormProps) {
  const { register, handleSubmit, control } = useForm<QuizCreatorForm>({
    defaultValues: { ...data.test },
  });

  const onSubmit: SubmitHandler<QuizCreatorForm> = (test) => {
    setData((prevData) => ({ ...prevData, test }));

    setActiveStep(Step.TIMELINE);
  };
  return (
    <>
      <div className="bg-white rounded-2 border border-solid border-[#B52326] sm:m-10 m-5 rounded-lg">
        <form
          className="flex flex-col items-center m-[60px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex md:w-full md:justify-start  ">
            <label className="text-gray-400 text-md mt-2 ">Test Name</label>
          </div>
          <input
            required
            className={`${styles.custom_input} ${
              type === 'edit' ? styles.custom_input_disabled : ''
            }`}
            placeholder="Test Name"
            {...register('name')}
            disabled={type === 'edit'}
          />
          <div className="flex md:w-full md:justify-start  ">
            <label className="text-gray-400 text-md mt-2 ">Test Type</label>
          </div>
          <SelectField
            control={control}
            isDisabled={type === 'edit' ? true : false}
            name_="type"
            options={TestTypeOptions}
            placeholder="Test Type"
          />
          <div className="flex md:w-full md:justify-start  ">
            <label className="text-gray-400 text-md mt-2 ">Test Format</label>
          </div>
          <SelectField
            control={control}
            name_="format"
            options={TestFormatOptions}
            placeholder="Test Format"
          />
          <div className="flex md:w-full md:justify-start ">
            <label className="text-gray-400 text-md  mt-2">Test Purpose</label>
          </div>
          <SelectField
            control={control}
            name_="purpose"
            options={TestPurposeOptions}
            placeholder="Test Purpose"
          />
          <div className="flex md:w-full md:justify-start  ">
            <label className="text-gray-400 text-md  mt-2">Test Platform</label>
          </div>
          <SelectField
            control={control}
            isDisabled={type === 'edit' ? true : false}
            name_="platform"
            options={TestPlatformOptions}
            placeholder="Test Platform"
          />
          <div className="flex md:w-full md:justify-start  ">
            <label className="text-gray-400 text-md mt-2 ">
              Marking Scheme
            </label>
          </div>
          {/* program, */}
          <SelectField
            isDisabled={type === 'edit' ? true : false}
            control={control}
            name_="markingScheme"
            options={MarkingSchemeOptions}
            placeholder="Marking Scheme"
          />
          <div className="flex md:w-full md:justify-start  ">
            <label className="text-gray-400 text-md  mt-2">
              Optional Limit
            </label>
          </div>
          <SelectField
            control={control}
            isDisabled={type === 'edit' ? true : false}
            name_="optionalLimit"
            options={OptionalLimitOptions}
            placeholder="Optional Limit"
          />

          {data.test.id ? (
            <>
              <div className="flex md:w-full md:justify-start ">
                <label className="text-gray-400 text-md  mt-2">Test id</label>
              </div>
              <input
                required
                className={`${styles.custom_input} ${
                  type === 'edit' ? styles.custom_input_disabled : ''
                }`}
                placeholder="Test id"
                {...register('id')}
                disabled={type === 'edit'}
              />
              <div className="flex md:w-full md:justify-start  ">
                <label className="text-gray-400 text-md mt-2 ">
                  Session Id
                </label>
              </div>
              <input
                required
                className={`${styles.custom_input} ${
                  type === 'edit' ? styles.custom_input_disabled : ''
                }`}
                placeholder="Test Session id"
                {...register('sessionId')}
                disabled={type === 'edit'}
              />
              <div className="flex md:w-full md:justify-start ">
                <label className="text-gray-400 text-md  mt-2">
                  Session Link
                </label>
              </div>
              <input
                required
                className={`${styles.custom_input} ${
                  type === 'edit' ? styles.custom_input_disabled : ''
                }`}
                placeholder="Test Session Link"
                {...register('sessionLink')}
                disabled={type === 'edit'}
              />
            </>
          ) : (
            <></>
          )}
          <div className="flex md:w-full md:justify-start ">
            <label className="text-gray-400 text-md  mt-2">CMS TEST ID</label>
          </div>
          <input
            required
            className={`${styles.custom_input} ${
              type === 'edit' ? styles.custom_input_disabled : ''
            }`}
            placeholder="CMS Test id"
            {...register('cmsId')}
            disabled={type === 'edit'}
          />
          <div className="w-full flex justify-between">
            <button
              className="rounded-lg sm:w-44 text-xs w-10 h-8 bg-[#B52326] text-white sm:h-11 mt-10"
              onClick={() => {
                setActiveStep(Step.STUDENT_DETAILS);
              }}
            >
              Back
            </button>
            <button
              type="submit"
              className="rounded-lg sm:w-44 text-xs w-10 h-8 bg-[#B52326] text-white sm:h-11 mt-10"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
