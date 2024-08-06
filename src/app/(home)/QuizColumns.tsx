'use client';

import { Session } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';
import { LinkAction, TableActions } from './Table/Actions';

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
    cell: ({ row }) => <div className="capitalize">{row.getValue('platform')}</div>,
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
    id: 'portalLink',
    accessorKey: 'portal_link',
    header: 'Portal Link',
    cell: ({ row }) => (
      <LinkAction value={row.getValue('portalLink')} status={row.original.meta_data?.status} />
    ),
  },
  {
    id: 'reportLink',
    accessorKey: 'meta_data.report_link',
    header: 'Report Link',
    cell: ({ row }) => (
      <LinkAction value={row.getValue('reportLink')} status={row.original.meta_data?.status} />
    ),
  },
  {
    id: 'adminLink',
    accessorKey: 'meta_data.admin_testing_link',
    header: 'Admin Link',
    cell: ({ row }) => (
      <LinkAction value={row.getValue('adminLink')} status={row.original.meta_data?.status} />
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
