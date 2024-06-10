'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Platform, Session, Status } from '@/types';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

export const columns: ColumnDef<Session>[] = [
  {
    accessorKey: 'id',
    header: 'S.No.',
  },
  {
    accessorKey: 'name',
    header: 'Name',
    enableColumnFilter: true,
  },
  {
    id: 'batch',
    accessorKey: 'meta_data.batch',
    header: 'Batch',
  },
  {
    id: 'startDate',
    accessorKey: 'start_time',
    header: 'Start Date',
    cell: ({ row }) => <div>{format(new Date(row.getValue('startDate')), 'dd/MM/yyyy')}</div>,
  },
  {
    id: 'actions',
    enableHiding: false,
    header: 'Actions',
    cell: function Cell({ row }) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link href={`/session/edit?step=student&id=${row.original.id}`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/session/duplicate?step=student&id=${row.original.id}`}>Dulplicate</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/session/view?id=${row.original.id}`}>View Details</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const filterFields = [
  {
    label: 'Name',
    value: 'name',
    placeholder: '',
  },
  {
    label: 'Status',
    value: 'status',
    options: Object.values(Status).map((item) => ({
      label: item.toUpperCase(),
      value: item,
    })),
  },
  {
    label: 'Platform',
    value: 'platform',
    options: Object.values(Platform).map((item) => ({
      label: item.toUpperCase(),
      value: item,
    })),
  },
];
