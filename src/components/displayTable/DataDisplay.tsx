import React, { useState, useEffect } from "react";
import { RowType } from "@/types/types";
import TableRow from "./Row";
import { getData } from "@/utils/forminputhandling";
import ReactPaginate from "react-paginate";
import { instance } from "@/utils/rootclient";

type DataDisplayProps = {
  getData: () => Promise<RowType[]>;
};

const DataDisplay: React.FC<DataDisplayProps> = ({ getData }) => {
  const [data, setData] = useState<RowType[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      const response = await instance.get(
        `/quiz?_page=${currentPage + 1}&_limit=${itemsPerPage}`
      );
      setData(response.data);
      const total = parseInt(response.headers["x-total-count"], 10);
      setTotalItems(total);
    };
    fetchData();
  }, [currentPage, getData]);
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
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"break-me px-2 py-1"}
          pageCount={Math.ceil(totalItems / itemsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={({ selected }) => setCurrentPage(selected)}
          containerClassName={
            "pagination flex flex-wrap justify-center items-center my-4"
          }
          pageClassName={"mx-1"}
          previousClassName={
            "mx-1 bg-[#B52326] text-white rounded px-2 py-1 sm:px-3 sm:py-2 hover: bg-[#B52326]"
          }
          nextClassName={
            "mx-1  bg-[#B52326] text-white rounded px-2 py-1 sm:px-3 sm:py-2 hover:bg- bg-[#B52326]"
          }
          activeClassName={" bg-[#B52326] text-white rounded px-3 py-2"}
          disabledClassName={"opacity-50 cursor-not-allowed"}
        />
      </div>
    </div>
  );
};

export default DataDisplay;
