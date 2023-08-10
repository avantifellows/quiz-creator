import React, { Dispatch, SetStateAction, useState } from "react";
import Select from "react-select";
import styles from "../../styles/Home.module.css";
import {
  CourseOptions,
  GradeOptions,
  ProgramOptions,
  StreamOptions,
  BatchOptions,
} from "../Options/StudentDetailsOptions";
import { OptionType } from "../Options/StudentDetailsOptions";

const Steps = {
  StudentDetails: "StudentDetails",
  TestDetails: "TestDetails",
};
// Renders the sub-page containing student details
export default function StudentDetails({
  setActiveStep,
}: {
  setActiveStep: Dispatch<SetStateAction<string>>;
}) {
  const [selectedProgram, setSelectedProgram] = useState<OptionType | null>(
    ProgramOptions[0]
  );
  const [selectedBatch, setSelectedBatch] = useState<OptionType | null>(
    BatchOptions[0]
  );

  const [selectedGrade, setSelectedGrade] = useState<OptionType | null>(
    GradeOptions[0]
  );
  const [selectedCourse, setSelectedCourse] = useState<OptionType | null>(
    CourseOptions[0]
  );
  const [selectedStream, setSelectedStream] = useState<OptionType | null>(
    StreamOptions[0]
  );

  return (
    <>
      <div className="bg-white rounded-2 border border-solid border-[#B52326] sm:m-10 m-5 rounded-lg">
        <form action="" className="flex flex-col items-center m-[60px]">
          {/* Select inputs */}
          <Select
            className={styles.custom_input}
            options={ProgramOptions}
            value={selectedProgram}
            onChange={(selectedOption) => setSelectedProgram(selectedOption)}
            instanceId="programSelect"
            isSearchable
            placeholder="Program"
          />
          <Select
            className={styles.custom_input}
            options={BatchOptions}
            value={selectedBatch}
            onChange={(selectedOption) => setSelectedBatch(selectedOption)}
            instanceId="batchSelect"
            isSearchable
            placeholder="Batch"
          />
          <Select
            className={styles.custom_input}
            options={GradeOptions}
            value={selectedGrade}
            onChange={(selectedOption) => setSelectedGrade(selectedOption)}
            instanceId="gradeSelect"
            isSearchable
            placeholder="Grade"
          />
          <Select
            className={styles.custom_input}
            options={CourseOptions}
            value={selectedCourse}
            onChange={(selectedOption) => setSelectedCourse(selectedOption)}
            instanceId="courseSelect"
            isSearchable
            placeholder="Course"
          />
          <Select
            className={styles.custom_input}
            options={StreamOptions}
            value={selectedStream}
            onChange={(selectedOption) => setSelectedStream(selectedOption)}
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
            onClick={() => {
              setActiveStep(Steps.TestDetails);
            }}
          >
            Next
          </button>
        </form>
      </div>
    </>
  );
}
