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
import type { ApiFormOptions, Session } from '@/types';
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import Filters from './Filters';
import Pagination from './Pagination';
import { SheetTableRow } from './Row';

export default function DataTable({
  data,
  hasMore,
  apiOptions,
  columns,
}: {
  columns: ColumnDef<Session>[];
  data: Session[];
  hasMore: boolean;
  apiOptions: ApiFormOptions;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') || 0);
  const perPage = Number(searchParams.get('per_page') || DATA_PER_PAGE);

  const initColumnsFilters = useMemo(() => {
    const filters = ['group', 'batchId', 'parentId'].reduce<ColumnFiltersState>((acc, key) => {
      const value = searchParams.get(key);
      if (value) acc.push({ id: key, value });
      return acc;
    }, []);
    return filters;
  }, [searchParams]);

  const table = useReactTable({
    data,
    columns,
    initialState: {
      columnFilters: initColumnsFilters,
      pagination: {
        pageIndex: page,
        pageSize: PAGE_SIZE_OPTIONS.includes(perPage) ? perPage : DATA_PER_PAGE,
      },
      columnVisibility: {
        startDate: false,
        endDate: false,
        createdAt: false,
        subject: false,
        platform: false,
        reportLink: false,
        parentId: false,
        batchId: false,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    pageCount: hasMore ? -1 : 0,
    manualPagination: true,
    manualFiltering: true,
  });

  const { pageIndex, pageSize, group, batchId, parentId } = useMemo(() => {
    const { columnFilters, pagination } = table.getState();
    const group = (columnFilters.find((item) => item.id === 'group')?.value as string) || '';
    const parentId = (columnFilters.find((item) => item.id === 'parentId')?.value as string) || '';
    const batchId = (columnFilters.find((item) => item.id === 'batchId')?.value as string) || '';
    return { ...pagination, group, parentId, batchId };
  }, [
    table.getState().columnFilters,
    table.getState().pagination.pageIndex,
    table.getState().pagination.pageSize,
  ]);

  useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        page: pageIndex.toString(),
        per_page: pageSize.toString(),
        group,
        batchId,
        parentId,
      })}`,
      { scroll: false }
    );
  }, [pageIndex, pageSize, group, batchId, parentId]);

  return (
    <>
      <Filters table={table} apiOptions={apiOptions} />
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
              <SheetTableRow table={table} formOptions={apiOptions?.formSchemas ?? []} />
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
