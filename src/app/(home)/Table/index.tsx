'use client';

import { DATA_PER_PAGE, PAGE_SIZE_OPTIONS } from '@/Constants';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { createQueryString } from '@/lib/utils';
import { Option, Session } from '@/types';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
} from '@tanstack/react-table';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { columns } from './Columns';
import Filters from './Filters';
import Pagination from './Pagination';
import { SheetTableRow } from './Row';

export default function DataTable({
  data,
  hasMore,
  formSchema,
}: {
  data: Session[];
  hasMore: boolean;
  formSchema: Option[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') || 0);
  const perPage = Number(searchParams.get('per_page') || DATA_PER_PAGE);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: page,
    pageSize: PAGE_SIZE_OPTIONS.includes(perPage) ? perPage : DATA_PER_PAGE,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      sorting,
      columnFilters,
    },
    initialState: {
      columnVisibility: {
        startDate: false,
        endDate: false,
        createdAt: false,
        testTakersCount: false,
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: hasMore ? -1 : 0,
    manualPagination: true,
  });

  useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        page: pagination.pageIndex,
        per_page: pagination.pageSize,
      })}`,
      {
        scroll: false,
      }
    );
  }, [pagination.pageIndex, pagination.pageSize]);

  return (
    <>
      <Filters table={table} />
      <div className="rounded-md text-center border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-center font-bold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              <SheetTableRow table={table} formSchema={formSchema} />
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination table={table} />
    </>
  );
}
