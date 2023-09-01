import { Step } from "@/pages/SessionCreator";
import styles from "@/styles/Home.module.css";
import { MyForm } from "@/types/FormTypes";
import { ActiveFormProps } from "@/types/types";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  BatchOptions,
  CourseOptions,
  GradeOptions,
  ProgramOptions,
  StreamOptions,
} from "../Options/StudentDetailsOptions";
import SelectField from "./Form/SelectField";

export default function StudentDetails({
  data,
  setActiveStep,
  setData,
}: ActiveFormProps) {
  const { register, handleSubmit, control } = useForm<MyForm>({
    defaultValues: { ...data.student },
  });

  const onSubmit: SubmitHandler<MyForm> = (student) => {
    setData((prevData) => ({ ...prevData, student }));

    setActiveStep(Step.TEST_DETAILS);
  };

  return (
    <div className="bg-white rounded-2 border border-solid border-[#B52326] sm:m-10 m-5 rounded-lg">
      <form
        className="flex flex-col items-center m-[60px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <SelectField
          control={control}
          name_="program"
          options={ProgramOptions}
        />
        <SelectField control={control} name_="batch" options={BatchOptions} />
        <SelectField control={control} name_="grade" options={GradeOptions} />
        <SelectField control={control} name_="course" options={CourseOptions} />
        <SelectField control={control} name_="stream" options={StreamOptions} />
        <input
          className={styles.custom_input}
          required
          type="number"
          {...register("testTakers")}
          placeholder="Test Taker Count"
        />

        <button
          type="submit"
          className="rounded-lg md:w-44 w-32 bg-[#B52326] text-white h-11 mt-10"
        >
          Next
        </button>
      </form>
    </div>
  );
}
