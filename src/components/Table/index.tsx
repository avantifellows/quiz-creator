'use client';

import type { Session } from '@/types/api.types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import ReactPaginate from 'react-paginate';
import TableRow from './Row';

interface TableProps {
  data: Session[];
  hasMore: boolean;
}

const Table = ({ data, hasMore }: TableProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = useMemo(() => Number(searchParams.get('pageNo')) || 0, [searchParams]);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  useEffect(() => setExpandedRow(null), [currentPage]);

  return (
    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
      <div className="overflow-x-auto">
        <table className="min-w-full text-center">
          <thead>
            <tr className="border-black border-2  p-2">
              <th className="border-none p-2">S.No</th>
              <th className="border-none p-2">Batch</th>
              <th className="border-none p-2">Test Name</th>
              <th className="border-none p-2">Start Date</th>
              <th className="border-none p-2">End Date</th>
              <th className="border-none p-2">Test Taker</th>
              <th className="border-none p-2">Report Link</th>
              <th className="border-none p-2">Portal Link</th>
              <th className="border-none p-2">Admin Testing Link</th>
              <th className="border-none p-2 ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <TableRow
                row={row}
                index={idx}
                itemsPerPage={10}
                key={row.id}
                currentPage={currentPage}
                isExpanded={row.id === expandedRow}
                toggleExpand={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
              />
            ))}
          </tbody>
        </table>
        <ReactPaginate
          initialPage={currentPage}
          previousLabel={'Previous'}
          nextLabel={'Next    '}
          breakClassName={'break-me px-2 py-1'}
          pageCount={hasMore ? currentPage + 2 : currentPage + 1}
          onPageChange={({ selected }) => router.push(`?pageNo=${selected}`)}
          containerClassName={'flex flex-wrap justify-between items-center my-4 w-full'}
          pageClassName={'mx-1 hidden'}
          previousClassName={
            'mx-1 bg-[#B52326] text-white rounded px-2 py-1 sm:px-3 sm:py-2 hover: bg-[#B52326]'
          }
          nextClassName={
            'mx-1  bg-[#B52326] w-24 text-center text-white rounded px-2 py-1 sm:px-3 sm:py-2 hover: bg-[#B52326]'
          }
          disabledClassName={'opacity-50 cursor-not-allowed'}
        />
      </div>
    </div>
  );
};

export default Table;
