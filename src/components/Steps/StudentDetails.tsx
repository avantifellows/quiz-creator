import { Step } from "@/pages/SessionCreator";
import { ActiveFormProps } from "@/types/types";
import { useState, type MouseEvent } from "react";
import Select from "react-select";
import styles from "../../styles/Home.module.css";
import {
  BatchOptions,
  CourseOptions,
  GradeOptions,
  OptionType,
  ProgramOptions,
  StreamOptions,
} from "../Options/StudentDetailsOptions";

export default function StudentDetails({
  setActiveStep,
  setData,
}: ActiveFormProps) {
  const [studentData, setStudentData] = useState<{
    [key: string]: OptionType | null;
  }>({
    program: null,
    batch: null,
    grade: null,
    course: null,
    stream: null,
  });

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setData((prevData) => ({ ...prevData, studentData }));

    setActiveStep(Step.TEST_DETAILS);
  };

  return (
    <div className="bg-white rounded-2 border border-solid border-[#B52326] sm:m-10 m-5 rounded-lg">
      <form className="flex flex-col items-center m-[60px]">
        <Select
          className={styles.custom_input}
          options={ProgramOptions}
          value={studentData.program}
          onChange={(selectedOption) =>
            setStudentData({
              ...studentData,
              program: selectedOption,
            })
          }
          instanceId="programSelect"
          isSearchable
          placeholder="Program"
        />
        <Select
          className={styles.custom_input}
          options={BatchOptions}
          value={studentData.batch}
          onChange={(selectedOption) =>
            setStudentData({
              ...studentData,
              batch: selectedOption,
            })
          }
          instanceId="batchSelect"
          isSearchable
          placeholder="Batch"
        />
        <Select
          className={styles.custom_input}
          options={GradeOptions}
          value={studentData.grade}
          onChange={(selectedOption) =>
            setStudentData({
              ...studentData,
              grade: selectedOption,
            })
          }
          instanceId="gradeSelect"
          isSearchable
          placeholder="Grade"
        />
        <Select
          className={styles.custom_input}
          options={CourseOptions}
          value={studentData.course}
          onChange={(selectedOption) =>
            setStudentData({
              ...studentData,
              course: selectedOption,
            })
          }
          instanceId="courseSelect"
          isSearchable
          placeholder="Course"
        />
        <Select
          className={styles.custom_input}
          options={StreamOptions}
          value={studentData.stream}
          onChange={(selectedOption) =>
            setStudentData({
              ...studentData,
              stream: selectedOption,
            })
          }
          instanceId="streamSelect"
          isSearchable
          placeholder="Stream"
        />
        <input
          className={styles.custom_input}
          placeholder="Test Takers Count"
        />

        <button
          className="rounded-lg md:w-44 w-32 bg-[#B52326] text-white h-11 mt-10"
          onClick={(e: MouseEvent<HTMLButtonElement>) => handleClick(e)}
        >
          Next
        </button>
      </form>
    </div>
  );
}
