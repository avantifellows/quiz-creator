'use client';

import { Tracker } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';

import { TrackerActions } from './TrackerActions';

export const columns: ColumnDef<Tracker>[] = [
  {
    accessorKey: 'id',
    header: 'S.No.',
    enableHiding: false,
  },
  {
    accessorKey: 'teacher_id',
    header: 'Teacher ID',
    enableColumnFilter: true,
    enableHiding: false,
  },
  {
    accessorKey: 'school_name',
    header: 'School',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('school_name') || 'N/A'}</div>,
    enableColumnFilter: true,
  },
  {
    accessorKey: 'program_type',
    header: 'Program Type',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('program_type') || 'N/A'}</div>,
    enableColumnFilter: true,
  },
  {
    accessorKey: 'session_type',
    header: 'Session Type',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('session_type') || 'N/A'}</div>,
    enableColumnFilter: true,
  },
  {
    id: 'session_date',
    accessorKey: 'session_date',
    header: 'Date',
    cell: ({ row }) =>
      row.getValue('session_date') ? format(new Date(row.getValue('session_date')), 'P') : 'N/A',
  },
  {
    id: 'session_duration',
    accessorKey: 'session_duration',
    header: 'Duration',
    cell: ({ row }) => `${row.getValue('session_duration') || 'N/A'} min`,
  },
  {
    id: 'createdAt',
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) =>
      row.getValue('createdAt') ? format(new Date(row.getValue('createdAt')), 'P') : 'N/A',
  },
  {
    id: 'isEnabled',
    accessorKey: 'is_active',
    header: 'Enabled',
    cell: ({ row }) =>
      row.getValue('isEnabled') ? (
        <Check className='mx-auto' color='darkgreen' />
      ) : (
        <X className='mx-auto' color='darkred' />
      ),
  },
  {
    id: 'actions',
    header: 'Actions',
    enableHiding: false,
    cell: ({ row }) => <TrackerActions tracker={row.original} />,
  },
];
