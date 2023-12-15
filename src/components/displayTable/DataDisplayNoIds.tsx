import TableRow from "./Row";
import ReactPaginate from "react-paginate";
import { DbTypes } from "@/types/ResponseTypes";
import { useRouter } from "next/router";

const DataDisplayNoIds = ({
  dataNoIds,
  hasMoreNoIds,
  currentPageNoIds,
  currentPage,
}: {
  dataNoIds: DbTypes[];
  hasMoreNoIds: boolean;
  currentPageNoIds: number;
  currentPage: number;
}) => {
  const router = useRouter();

  const itemsPerPage = 5;

  return (
    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
      <div className="overflow-x-auto">
        <table className="min-w-full border text-center">
          <thead className="">
            <tr>
              <th className="border p-2">S.No</th>
              <th className="border p-2">Batch</th>
              <th className="border p-2">Test Name</th>
              <th className="border p-2">Start Date</th>
              <th className="border p-2">End Date</th>
              <th className="border p-2">Test Taker</th>
              <th className="border p-2">Report Link</th>
              <th className="border p-2">Portal Link</th>
              <th className="border p-2">Admin Testing Link</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataNoIds.map((row, i) => (
              <TableRow
                key={i}
                row={row}
                index={i}
                currentPage={currentPageNoIds}
                itemsPerPage={itemsPerPage}
              />
            ))}
          </tbody>
        </table>
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={hasMoreNoIds ? currentPageNoIds + 2 : currentPageNoIds + 1}
          onPageChange={({ selected }) => {
            router.push(`/?pageData=${currentPage}&pageNoIds=${selected}`);
          }}
          containerClassName={
            "pagination flex flex-wrap justify-between items-center my-4"
          }
          pageClassName={"mx-1 hidden"}
          previousClassName={
            "mx-1 bg-[#B52326] text-white rounded px-2 py-1 sm:px-3 sm:py-2 hover: bg-[#B52326]"
          }
          nextClassName={
            "mx-1  bg-[#B52326] text-white rounded px-2 py-1 sm:px-3 sm:py-2 hover:bg- bg-[#B52326]"
          }
          disabledClassName={"opacity-50 cursor-not-allowed"}
        />
      </div>
    </div>
  );
};

export default DataDisplayNoIds;
