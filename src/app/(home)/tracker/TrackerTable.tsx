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
import type { Tracker } from '@/types';
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import Pagination from '../Table/Pagination';
import { TrackerSheetRow } from './TrackerRow';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { TrackerFilters } from './TrackerFilters';

export default function TrackerTable({
  data,
  hasMore,
  formSchemas = [],
  columns,
}: {
  columns: ColumnDef<Tracker>[];
  data: Tracker[];
  hasMore: boolean;
  formSchemas?: any[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') || 0);
  const perPage = Number(searchParams.get('per_page') || DATA_PER_PAGE);

  // Initialize column filters from URL params - now just for tracker_session_type
  const initColumnsFilters = useMemo(() => {
    const filters: ColumnFiltersState = [];
    const sessionType = searchParams.get('tracker_session_type');
    if (sessionType) {
      filters.push({ id: 'tracker_session_type', value: sessionType });
    }
    return filters;
  }, [searchParams]);

  const table = useReactTable<Tracker>({
    data,
    columns,
    initialState: {
      columnFilters: initColumnsFilters,
      pagination: {
        pageIndex: page,
        pageSize: PAGE_SIZE_OPTIONS.includes(perPage) ? perPage : DATA_PER_PAGE,
      },
      columnVisibility: {
        createdAt: false,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    pageCount: hasMore ? -1 : 0,
    manualPagination: true,
    manualFiltering: true,
  });

  const { pageIndex, pageSize } = useMemo(() => {
    const { pagination } = table.getState();
    return pagination;
  }, [table.getState().pagination.pageIndex, table.getState().pagination.pageSize]);

  // Get the current tracker_session_type filter value
  const sessionTypeFilter = useMemo(() => {
    const filter = table.getState().columnFilters.find((f) => f.id === 'tracker_session_type');
    return (filter?.value as string) || '';
  }, [table.getState().columnFilters]);

  useEffect(() => {
    const queryParams: Record<string, string> = {
      page: pageIndex.toString(),
      per_page: pageSize.toString(),
    };

    // Add session type filter if present
    if (sessionTypeFilter) {
      queryParams.tracker_session_type = sessionTypeFilter;
    }

    router.push(`${pathname}?${createQueryString(queryParams)}`, { scroll: false });
  }, [pageIndex, pageSize, sessionTypeFilter, pathname, router]);

  return (
    <>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>Tracking Data</h1>
        <Link href='/tracker/create' prefetch={false}>
          <Button>
            <Plus className='mr-2 h-4 w-4' /> Add Tracking
          </Button>
        </Link>
      </div>

      {/* Simplified filters component */}
      <TrackerFilters table={table} />

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
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
            <TrackerSheetRow table={table} formOptions={formSchemas} />
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Pagination table={table} />
    </>
  );
}
