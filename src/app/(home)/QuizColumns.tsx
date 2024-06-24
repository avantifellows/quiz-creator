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
import { Session } from '@/types';
import { Check, LinkIcon, MoreHorizontal, X } from 'lucide-react';
import Link from 'next/link';

export const columns: ColumnDef<Session>[] = [
  {
    accessorKey: 'id',
    header: 'S.No.',
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    enableColumnFilter: true,
    enableHiding: false,
  },
  {
    id: 'startDate',
    accessorKey: 'start_time',
    header: 'Start Date',
    cell: ({ row }) => format(new Date(row.getValue('startDate')), 'dd/MM/yyyy'),
  },
  {
    id: 'endDate',
    accessorKey: 'end_time',
    header: 'End Date',
    cell: ({ row }) => format(new Date(row.getValue('endDate')), 'dd/MM/yyyy'),
  },
  {
    id: 'createdAt',
    accessorKey: 'meta_data.date_created',
    header: 'Created At',
    cell: ({ row }) =>
      row.getValue('createdAt') ? format(new Date(row.getValue('createdAt')), 'dd/MM/yyyy') : 'N/A',
  },
  {
    accessorKey: 'platform',
    header: 'Platform',
    cell: ({ row }) => <div className="capitalize">{row.getValue('platform')}</div>,
  },
  {
    id: 'group',
    accessorKey: 'meta_data.group',
    header: 'Group',
    cell: ({ row }) => (row.getValue('group') ? row.getValue('group') : 'N/A'),
  },
  {
    id: 'testTakersCount',
    accessorKey: 'meta_data.test_takers_count',
    header: 'Test Takers',
  },
  {
    id: 'portalLink',
    accessorKey: 'portal_link',
    header: 'Portal Link',
    cell: ({ row }) => (
      <>
        {row.getValue('portalLink') ? (
          <Link
            href={row.getValue('portalLink')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex p-1"
          >
            <LinkIcon className="size-4 mx-auto cursor-pointer" />
          </Link>
        ) : (
          '-'
        )}
      </>
    ),
  },
  {
    id: 'reportLink',
    accessorKey: 'meta_data.report_link',
    header: 'Report Link',
    cell: ({ row }) => (
      <>
        {row.getValue('reportLink') ? (
          <Link
            href={row.getValue('reportLink')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex p-1"
          >
            <LinkIcon className="size-4 mx-auto cursor-pointer" />
          </Link>
        ) : (
          '-'
        )}
      </>
    ),
  },
  {
    id: 'adminLink',
    accessorKey: 'meta_data.admin_testing_link',
    header: 'Admin Link',
    cell: ({ row }) => (
      <>
        {row.getValue('adminLink') ? (
          <Link
            href={row.getValue('adminLink')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex p-1"
          >
            <LinkIcon className="size-4 mx-auto cursor-pointer" />
          </Link>
        ) : (
          '-'
        )}
      </>
    ),
  },
  {
    id: 'isEnabled',
    accessorKey: 'meta_data.enabled',
    header: 'Enabled',
    cell: ({ row }) =>
      row.getValue('isEnabled') ? (
        <Check className="mx-auto" color="darkgreen" />
      ) : (
        <X className="mx-auto" color="darkred" />
      ),
  },
  {
    id: 'actions',
    header: 'Actions',
    enableHiding: false,
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
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={`/session/edit?id=${row.original.id}`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={`/session/duplicate?id=${row.original.id}`}>Duplicate</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={`/session?id=${row.original.id}`}>View Details</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
