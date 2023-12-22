import styles from "../../styles/Home.module.css";

import { Step } from "@/pages/SessionCreator";
import { QuizCreatorForm } from "@/types/FormTypes";
import { ActiveFormProps } from "@/types/types";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  MarkingSchemeOptions,
  OptionalLimitOptions,
  TestFormatOptions,
  TestPlatformOptions,
  TestPurposeOptions,
  TestTypeOptions,
} from "../Options/TestDetailsOptions";
import SelectField from "./Form/SelectField";

// Renders sub-page containing test details

export function TestDetails({ data, setActiveStep, setData }: ActiveFormProps) {
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
          <input
            required
            className={styles.custom_input}
            placeholder="Test Name"
            {...register("name")}
          />
          <SelectField
            control={control}
            name_="type"
            options={TestTypeOptions}
            placeholder="Test Type"
          />
          <SelectField
            control={control}
            name_="format"
            options={TestFormatOptions}
            placeholder="Test Format"
          />
          <SelectField
            control={control}
            name_="purpose"
            options={TestPurposeOptions}
            placeholder="Test Purpose"
          />
          <SelectField
            control={control}
            name_="platform"
            options={TestPlatformOptions}
            placeholder="Test Platform"
          />
          <SelectField
            control={control}
            name_="markingScheme"
            options={MarkingSchemeOptions}
            placeholder="Test Purpose"
          />
          <SelectField
            control={control}
            name_="optionalLimit"
            options={OptionalLimitOptions}
            placeholder="Optional Limit"
          />

          {data.test.id ? (
            <>
              <input
                required
                className={styles.custom_input}
                placeholder="Test id"
                {...register("id")}
              />
              <input
                required
                className={styles.custom_input}
                placeholder="Test Session id"
                {...register("sessionId")}
              />
              <input
                required
                className={styles.custom_input}
                placeholder="Test Session Link"
                {...register("sessionLink")}
              />
            </>
          ) : (
            <></>
          )}
          <input
            required
            className={styles.custom_input}
            placeholder="CMS Test id"
            {...register("cmsId")}
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
