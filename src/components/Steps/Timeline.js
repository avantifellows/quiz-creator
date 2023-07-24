import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from "../../styles/Home.module.css";

import Select from "react-select";
import {
  HasSyncedOptions,
  InfiniteSessionsOptions,
  IsEnabledOptions,
} from "../Options/TimelineOptions";

export default function Timeline({ setActiveStep }) {
  const router = useRouter();
  const [selectedSynced, setSelectedSynced] = useState(null);
  const [selectedIsEnabled, setSelectedIsEnabled] = useState(null);
  const [selectedInfiniteSessions, setSelectedInfiniteSessions] =
    useState(null);

  return (
    <>
      <div className="bg-white rounded-2 border border-solid border-[#B52326] sm:m-10 m-5 rounded-lg">
        <form action="" className="flex flex-col items-center m-[60px]">
          <div>
            <div className="flex sm:mb-5 sm:space-x-5 mb-3 space-x-1 flex-col sm:flex-row space-y-3 sm:space-y-0">
              <p className="text-xs sm:text-sm">Start Date</p>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded sm:w-full sm:p-2.5 w-20"
                placeholder="Start Date"
                type="date"
              />
              <p className="text-xs sm:text-sm">End Date</p>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded  sm:w-full sm:p-2.5  w-20"
                placeholder="End Date"
                type="date"
              />
            </div>
          </div>

          <div className="flex sm:mb-5 sm:space-x-5 space-x-1 mt-3 flex-col md:flex-row space-y-3 sm:space-y-0">
            <p className="text-xs sm:text-sm">Start Time</p>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded block sm:w-full sm:p-2.5"
              placeholder="Start Time"
              type="time"
            />
            <p className="text-xs sm:text-sm">End Time</p>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded block sm:w-full sm:p-2.5"
              placeholder="End Time"
              type="time"
            />
          </div>
          <Select
            className={styles.custom_input}
            options={IsEnabledOptions}
            value={selectedIsEnabled}
            onChange={(selectedOption) => setSelectedIsEnabled(selectedOption)}
            instanceId="is_enabledSelect"
            isSearchable
            placeholder="Is Enabled"
          />
          <Select
            className={styles.custom_input}
            options={InfiniteSessionsOptions}
            value={selectedInfiniteSessions}
            onChange={(selectedOption) =>
              setSelectedInfiniteSessions(selectedOption)
            }
            instanceId="infinite_sessionsSelect"
            isSearchable
            placeholder="Infinite Sessions"
          />
          <Select
            className={styles.custom_input}
            options={HasSyncedOptions}
            value={selectedSynced}
            onChange={(selectedOption) => setSelectedSynced(selectedOption)}
            instanceId="has_syancedSelect"
            isSearchable
            placeholder="Has Synced"
          />
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10"
            placeholder="Report Schedule"
          />
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 mt-10"
            placeholder="Report Link"
          />

          <div className="w-full flex justify-between">
            <button
              className="rounded-lg sm:w-44 w-10 text-xs h-8 bg-[#B52326] text-white sm:h-11 mt-10"
              onClick={() => {
                setActiveStep("TestDetails");
              }}
            >
              Back
            </button>
            <button
              className="rounded-lg sm:w-44 text-xs w-10 h-8 bg-[#B52326] text-white sm:h-11 mt-10"
              onClick={() => {
                router.push("/sessionInfo");
              }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
