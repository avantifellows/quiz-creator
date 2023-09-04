import React, { useState } from "react";
import { Copy, Edit, Trash2 } from "react-feather";
import { RowType } from "@/types/types";

const TableRow = ({ row, index }: { row: RowType; index: number }) => {
  const [isExpand, setIsExpand] = useState<boolean>(false);
  const {
    student: { batch, testTakers },
    test: { name, sessionLink, type, format, purpose, optionalLimit },
    timeline: {
      reportLink,
      startDate,
      endDate,
      sessionType,
      reportSchedule,
      endTime,
      startTime,
      synced,
      isEnabled,
    },
  } = row!;
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  return (
    <>
      <tr className="border text-center" onClick={() => setIsExpand(!isExpand)}>
        <td className="border p-2">{index}</td>
        <td className="border p-2">{batch}</td>
        <td className="border p-2">{name}</td>
        <td className="border p-2">{startDate}</td>
        <td className="border p-2">{endDate}</td>
        <td className="border p-2">{testTakers}</td>
        <td className="border p-2">{reportLink}</td>
        <td className="border p-2">{sessionLink}</td>
        <td className="border p-2 flex gap-2 justify-center">
          <Copy
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              console.log("copy");
            }}
          />
          <Edit
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              console.log("edit");
            }}
          />
          <Trash2
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              console.log("delete");
            }}
          />
        </td>
      </tr>

      {/* Collapsible Container */}
      {isExpand && (
        <tr className="bg-slate-100">
          <td colSpan={9}>
            <table style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td>Test_type: {type}</td>
                  <td>Test Takers Count: {testTakers}</td>
                  <td>date_created: {formattedDate}</td>
                  <td>infinite_session: {sessionType}</td>
                </tr>
                <tr>
                  <td>test_format: {format}</td>
                  <td>optinal_limit: {optionalLimit}</td>
                  <td>start_time: {startTime}</td>
                  <td>has_synced: {synced}</td>
                </tr>
                <tr>
                  <td>test_purpose: {purpose}</td>
                  <td>is_enabled: {isEnabled}</td>
                  <td>end_time: {endTime}</td>
                  <td>repeat_schedule: {reportSchedule}</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      )}
    </>
  );
};

export default TableRow;
