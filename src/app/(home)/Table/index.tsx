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
import { Input } from '@/components/ui/input';
import usePolling from '@/hooks/usePolling';
import useStuckPendingTimeout from '@/hooks/useStuckPendingTimeout';
import { createQueryString } from '@/lib/utils';
import { markSessionAsFailed } from '@/services/services';
import type { ApiFormOptions, Session } from '@/types';
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
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
  const [searchTerm, setSearchTerm] = useState('');
  const page = Number(searchParams.get('page') || 0);
  const perPage = Number(searchParams.get('per_page') || DATA_PER_PAGE);
  const tableData = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    if (!normalizedSearchTerm) return data;

    return data.filter((session) => {
      const searchableText = [
        session.id,
        session.name,
        session.session_id,
        session.platform_id,
        session.meta_data?.cms_test_id,
        session.meta_data?.group,
        session.meta_data?.parent_id,
        session.meta_data?.batch_id,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(normalizedSearchTerm);
    });
  }, [data, searchTerm]);
  const initColumnsFilters = useMemo(() => {
    const filters = ['group', 'batchId', 'parentId'].reduce<ColumnFiltersState>((acc, key) => {
      const value = searchParams.get(key);
      if (value) acc.push({ id: key, value });
      return acc;
    }, []);
    return filters;
  }, [searchParams]);

  const table = useReactTable<Session>({
    data: tableData,
    columns,
    initialState: {
      columnFilters: initColumnsFilters,
      pagination: {
        pageIndex: page,
        pageSize: PAGE_SIZE_OPTIONS.includes(perPage) ? perPage : DATA_PER_PAGE,
      },
      columnVisibility: {
        timing: false,
        createdAt: false,
        subject: false,
        platform: false,
        reportLink: false,
        parentId: false,
        batchId: false,
        stream: false,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    pageCount: hasMore ? -1 : 0,
    manualPagination: true,
    manualFiltering: true,
    meta: {
      apiOptions,
    },
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

  const { pendingSessions } = usePolling(data);

  const handleStuckSessionExpired = useCallback(
    async (session: Session) => {
      const { isSuccess } = await markSessionAsFailed(session);
      if (isSuccess) {
        toast.error('Session creation timed out', {
          description: `Session "${session.name}" took too long. Marked as failed. Please retry if needed.`,
          duration: 5000,
        });
        router.refresh();
      }
    },
    [router]
  );

  useStuckPendingTimeout(data, handleStuckSessionExpired);

  return (
    <>
      <Filters table={table} apiOptions={apiOptions} />
      <div className='mb-4 flex flex-col gap-1 md:max-w-md'>
        <Input
          placeholder='Search loaded rows by name, DB id, session id, batch...'
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <p className='text-xs text-muted-foreground'>
          Searches the rows loaded on this page. Use filters for server-side narrowing.
        </p>
      </div>
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
            <SheetTableRow
              table={table}
              formOptions={[...(apiOptions?.signupForm ?? []), ...(apiOptions?.popupForm ?? [])]}
              batchListOptions={apiOptions?.batch ?? []}
              pendingSessions={pendingSessions}
            />
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
