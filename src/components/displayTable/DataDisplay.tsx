import { RowType } from "@/types/types";
import TableRow from "./Row";

const DataDisplay = ({ data }: { data: RowType[] }) => {
  return (
    <table className="w-full border-collapse border mr-5 ml-5">
      <thead>
        <tr>
          <th className="border p-2">S.No</th>
          <th className="border p-2">Batch</th>
          <th className="border p-2">Test Name</th>
          <th className="border p-2">Start Date</th>
          <th className="border p-2">End Date</th>
          <th className="border p-2">Test Taker</th>
          <th className="border p-2">Report Link</th>
          <th className="border p-2">Test Link</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <TableRow row={row} index={i} key={i} />
        ))}
      </tbody>
    </table>
  );
};

export default DataDisplay;
