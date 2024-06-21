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
import { DataSection, Session } from '@/types';
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
    cell: ({ row }) => format(new Date(row.getValue('createdAt')), 'dd/MM/yyyy'),
  },
  {
    accessorKey: 'platform',
    header: 'Platform',
    cell: ({ row }) => <div className="capitalize">{row.getValue('platform')}</div>,
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

export const displayData = (data: Session) => {
  const basicDetails: DataSection = {
    title: 'Basic Details',
    data: [
      { label: 'Platform', value: data.platform },
      { label: 'Program', value: data.meta_data?.group },
      { label: 'Batch', value: data.meta_data?.batch },
      { label: 'Grade', value: data.meta_data?.grade },
      { label: 'Session Type', value: data.type },
      { label: 'Auth Type', value: data.auth_type },
      { label: 'Activate Sign-Up', value: data.is_active ? 'Yes' : 'No' },
      { label: 'Is pop up form allowed', value: data.popup_form ? 'Yes' : 'No' },
      {
        label: 'Number fields in pop up form',
        value: data.meta_data?.number_of_fields_in_popup_form,
      },
      { label: 'Is redirection allowed', value: data.redirection ? 'Yes' : 'No' },
      { label: 'Is Id generation allowed', value: data.id_generation ? 'Yes' : 'No' },
      { label: 'Signup form name', value: data.meta_data?.signup_form_name ?? 'N/A' },
    ],
  };

  const quizDetails: DataSection | null =
    data.platform === 'quiz'
      ? {
          title: 'Quiz Details',
          data: [
            { label: 'Course', value: data.meta_data?.course },
            { label: 'Stream', value: data.meta_data?.stream },
            { label: 'Test Name', value: data.name },
            { label: 'Test Format', value: data.meta_data?.test_format },
            { label: 'Test Purpose', value: data.meta_data?.test_purpose },
            { label: 'Test Type', value: data.meta_data?.test_type },
            {
              label: 'CMS Link',
              value: data.meta_data?.cms_test_id ?? 'N/A',
              isLink: !!data.meta_data?.cms_test_id,
            },
            { label: 'Marking Scheme', value: data.meta_data?.marking_scheme },
            { label: 'Optional Limits', value: data.meta_data?.optional_limits },
            { label: 'Show Answers', value: data.meta_data?.show_answers ? 'Yes' : 'No' },
            { label: 'Portal Link', value: data.portal_link ?? 'N/A', isLink: !!data.portal_link },
            {
              label: 'Admin Link',
              value: data.meta_data?.admin_testing_link ?? 'N/A',
              isLink: !!data.meta_data?.admin_testing_link,
            },
            {
              label: 'Report Link',
              value: data.meta_data?.report_link ?? 'N/A',
              isLink: !!data.meta_data?.report_link,
            },
          ],
        }
      : null;

  const timeDetails: DataSection = {
    title: 'Time Details',
    data: [
      { label: 'Start Date & Time', value: format(new Date(data.start_time!), 'PPp') },
      { label: 'End Date & Time', value: format(new Date(data.end_time!), 'PPp') },
      { label: 'Test Takers', value: data.meta_data?.test_takers_count },
      { label: 'Is Enabled', value: data.meta_data?.enabled ? 'Yes' : 'No' },
      { label: 'Has Synced', value: data.meta_data?.has_synced_to_bq },
      { label: 'Created At', value: format(new Date(data.meta_data?.date_created ?? ''), 'PPp') },
    ],
  };

  // Filter out any null sections
  const showingData: DataSection[] = [basicDetails, quizDetails, timeDetails].filter(
    Boolean
  ) as DataSection[];

  return showingData;
};
