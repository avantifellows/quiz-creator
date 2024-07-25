'use client';

import { Session } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';

import { LinkAction, TableActions } from '../Table/Actions';

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
    header: 'Batches',
    cell: ({ row }) => row.getValue('batchId') || 'N/A',
  },
  {
    id: 'subject',
    accessorKey: 'meta_data.subject',
    header: 'Subjects',
  },
  {
    id: 'timing',
    accessorFn: ({ start_time, end_time }) =>
      `${start_time ? format(new Date(start_time), 'p') : 'N/A'} - ${end_time ? format(new Date(end_time), 'p') : 'N/A'}`,
    header: 'Timings',
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
      <LinkAction value={row.getValue('platformLink')} pending={!row.original.session_id} />
    ),
  },
  {
    id: 'portalLink',
    accessorKey: 'portal_link',
    header: 'Portal Link',
    cell: ({ row }) => (
      <LinkAction value={row.getValue('portalLink')} pending={!row.original.session_id} />
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
    cell: ({ row }) => <TableActions session={row.original} />,
  },
];
