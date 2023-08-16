import { RowType } from "@/types/types";
import { useState } from "react";

const TableRow = ({ row, index }: { row: RowType; index: number }) => {
  const [isExpand, setIsExpand] = useState<boolean>(false);
  const {
    studentData: { batch },
    testData: { testName, testLink, testTaker },
    timelineData: { reportLink, startDate, endDate },
  } = row!;

  return (
    <>
      <tr className="border text-center" onClick={() => setIsExpand(!isExpand)}>
        <td className="border p-2">{index}</td>
        <td className="border p-2">
          {typeof batch === "object" && batch!.value}
        </td>
        <td className="border p-2">
          {typeof testName === "string" && testName}
        </td>
        <td className="border p-2">
          {typeof startDate === "string" && startDate}
        </td>
        <td className="border p-2">{typeof endDate === "string" && endDate}</td>
        <td className="border p-2">
          {typeof testTaker === "string" && testTaker}
        </td>
        <td className="border p-2">
          {typeof reportLink === "string" && reportLink}
        </td>
        <td className="border p-2">
          {typeof testLink === "string" && testLink}
        </td>
        <td className="border p-2">
          <div>A</div>
          <div>B</div>
          <div>C</div>
        </td>
      </tr>

      {/* Collabsable Container */}
      {isExpand && (
        <tr className="bg-slate-100">
          <div>Helllo world</div>
        </tr>
      )}
    </>
  );
};

export default TableRow;
