import React, { useState } from "react";
import Select from "react-select";
import styles from "../../styles/Home.module.css";
import {
  courseOptions,
  gradeOptions,
  programOptions,
  streamOptions,
  testTakersOptions,
  BatchOptions,
} from "../Options/StudentDetailsOptions";

export default function StudentDetails({ setActiveStep }) {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedStream, setSelectedStream] = useState(null);
  const [selectedTestTakers, setSelectedTestTakers] = useState(null);
  return (
    <>
      <div className="bg-white rounded-2 border border-solid border-[#B52326] sm:m-10 m-5 rounded-lg">
        <form action="" className="flex flex-col items-center m-[60px]">
          <Select
            className={styles.custom_input}
            options={programOptions}
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
            options={gradeOptions}
            value={selectedGrade}
            onChange={(selectedOption) => setSelectedGrade(selectedOption)}
            instanceId="gradeSelect"
            isSearchable
            placeholder="Grade"
          />
          <Select
            className={styles.custom_input}
            options={courseOptions}
            value={selectedCourse}
            onChange={(selectedOption) => setSelectedCourse(selectedOption)}
            instanceId="courseSelect"
            isSearchable
            placeholder="Course"
          />
          <Select
            className={styles.custom_input}
            options={streamOptions}
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
            className="rounded-lg md:w-44 w-32 bg-[#B52326] text-white h-11 mt-10 "
            onClick={() => {
              setActiveStep("TestDetails");
            }}
          >
            Next
          </button>
        </form>
      </div>
    </>
  );
}
