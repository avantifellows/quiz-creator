import { RowType } from "@/types/types";
import TableRow from "./Row";
import { getData } from "@/utils/api";

const DataDisplay = ({ data }: { data: RowType[] }) => {
  getData();
  return (
    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
      <div className="overflow-x-auto">
        <table className="min-w-full border text-cente">
          <thead className="">
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
      </div>
    </div>
  );
};

export default DataDisplay;
