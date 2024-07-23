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
import { patchSession, sendCreateSns } from '@/services/services';
import { Session } from '@/types';
import { Check, LinkIcon, MoreHorizontal, X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

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
    accessorKey: 'platform',
    header: 'Platform',
    cell: ({ row }) => <div className="capitalize">{row.getValue('platform') || 'N/A'}</div>,
  },
  {
    id: 'group',
    accessorKey: 'meta_data.group',
    header: 'Group',
    cell: ({ row }) => row.getValue('group') || 'N/A',
  },
  {
    id: 'parentId',
    accessorKey: 'meta_data.parent_id',
    header: 'Parent Batch',
    cell: ({ row }) => row.getValue('parentId') || 'N/A',
  },
  {
    id: 'batchId',
    accessorKey: 'meta_data.batch_id',
    header: 'Sub Batch',
    cell: ({ row }) => row.getValue('batchId') || 'N/A',
  },
  {
    id: 'subject',
    accessorKey: 'meta_data.subject',
    header: 'Subject',
  },
  {
    id: 'startDate',
    accessorKey: 'start_time',
    header: 'Start Time',
    cell: ({ row }) => format(new Date(row.getValue('startDate')), 'p'),
  },
  {
    id: 'endDate',
    accessorKey: 'end_time',
    header: 'End Time',
    cell: ({ row }) => format(new Date(row.getValue('endDate')), 'p'),
  },
  {
    id: 'createdAt',
    accessorKey: 'meta_data.date_created',
    header: 'Created At',
    cell: ({ row }) =>
      row.getValue('createdAt') ? format(new Date(row.getValue('createdAt')), 'P') : 'N/A',
  },
  {
    id: 'platformLink',
    accessorKey: 'platform_link',
    header: 'Platform Link',
    cell: ({ row }) => (
      <>
        {row.getValue('platformLink') ? (
          <Link
            href={row.getValue('platformLink')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex p-1"
            prefetch={false}
            onClick={(event) => event.stopPropagation()}
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
            prefetch={false}
            onClick={(event) => event.stopPropagation()}
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
    accessorKey: 'is_active',
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
              <Button
                variant="ghost"
                className="w-full focus-visible:ring-0 justify-start font-normal"
                onClick={async (e) => {
                  e.stopPropagation();
                  await patchSession(
                    {
                      is_active: !row.original.is_active,
                    },
                    row.original.id ?? 0
                  );
                  toast.success(
                    row.original.is_active ? 'Disabled the session' : 'Enabled the session',
                    { description: 'Please refresh the page after a while.' }
                  );
                }}
              >
                {row.original.is_active ? 'Disable' : 'Enable'} Session
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Button
                variant="ghost"
                className="w-full focus-visible:ring-0 justify-start font-normal"
                onClick={(e) => {
                  e.stopPropagation();
                  sendCreateSns(row.original.id);
                  toast.success('Request send successfully', {
                    description:
                      'The links will be available/updated shortly. Please refresh the page after a while.',
                  });
                }}
              >
                Regenerate Links
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
