import { MouseEvent, useState } from "react";
import styles from "../../styles/Home.module.css";

import { Step } from "@/pages/SessionCreator";
import { ActiveFormProps } from "@/types/types";
import Select from "react-select";
import { OptionType } from "../Options/StudentDetailsOptions";
import {
  MarkingSchemeOptions,
  OptionalLimitOptions,
  TestFormatOptions,
  TestPlatformOptions,
  TestPurposeOptions,
  TestTypeOptions,
} from "../Options/TestDetailsOptions";

// Renders sub-page containing test details

export function TestDetails({ setActiveStep, setData }: ActiveFormProps) {
  const [testData, setTestData] = useState<{
    [key: string]: OptionType | null;
  }>({
    testType: null,
    testFormat: null,
    testPurpose: null,
    testPlatform: null,
    markingScheme: null,
    optionalLimit: null,
  });

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setData((prevData: Object) => ({ ...prevData, testData }));
    setActiveStep(Step.TIMELINE);
  };

  return (
    <>
      <div className="bg-white rounded-2 border border-solid border-[#B52326] sm:m-10 m-5 rounded-lg">
        <form action="" className="flex flex-col items-center m-[60px]">
          <input className={styles.custom_input} placeholder="Test Name" />
          <Select
            className={styles.custom_input}
            options={TestTypeOptions}
            value={testData.testType}
            onChange={(selectedOption) =>
              setTestData({
                ...testData,
                testType: selectedOption,
              })
            }
            instanceId="test_typeSelect"
            isSearchable
            placeholder="Test Type"
          />
          <Select
            className={styles.custom_input}
            options={TestFormatOptions}
            value={testData.testFormat}
            onChange={(selectedOption) =>
              setTestData({
                ...testData,
                testFormat: selectedOption,
              })
            }
            instanceId="test_formatSelect"
            isSearchable
            placeholder="Test Format"
          />
          <Select
            className={styles.custom_input}
            options={TestPurposeOptions}
            value={testData.testPurpose}
            onChange={(selectedOption) =>
              setTestData({
                ...testData,
                testPurpose: selectedOption,
              })
            }
            instanceId="test_purposeSelect"
            isSearchable
            placeholder="Test Purpose"
          />
          <Select
            className={styles.custom_input}
            options={TestPlatformOptions}
            value={testData.testPlatform}
            onChange={(selectedOption) =>
              setTestData({
                ...testData,
                testPlatform: selectedOption,
              })
            }
            instanceId="test_platformSelect"
            isSearchable
            placeholder="Test Platform"
          />
          <Select
            className={styles.custom_input}
            options={OptionalLimitOptions}
            value={testData.markingScheme}
            onChange={(selectedOption) =>
              setTestData({
                ...testData,
                markingScheme: selectedOption,
              })
            }
            isSearchable
            instanceId="marking_schemeSelect"
            placeholder="Marking Scheme"
          />

          <Select
            className={styles.custom_input}
            options={MarkingSchemeOptions}
            value={testData.optionalLimit}
            onChange={(selectedOption) =>
              setTestData({
                ...testData,
                optionalLimit: selectedOption,
              })
            }
            isSearchable
            instanceId="Optional_limitSelect"
            placeholder="Optional Limit"
          />
          <input className={styles.custom_input} placeholder="Test id" />
          <input
            className={styles.custom_input}
            placeholder="Test Session id"
          />
          <input
            className={styles.custom_input}
            placeholder="Test Session Link"
          />
          <input className={styles.custom_input} placeholder="CMS Test id" />
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
              className="rounded-lg sm:w-44 text-xs w-10 h-8 bg-[#B52326] text-white sm:h-11 mt-10"
              onClick={(e: MouseEvent<HTMLButtonElement>) => handleClick(e)}
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
