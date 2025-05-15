import { format } from 'date-fns';
import { Option, Tracker } from '@/types';

type DisplayData = {
  title: string;
  data: {
    label: string;
    value: string;
    isLink?: boolean;
  }[];
}[];

export const displayTrackerData = (tracker: Tracker, options: Option[]): DisplayData => {
  return [
    {
      title: 'Basic Information',
      data: [
        {
          label: 'Teacher ID',
          value: tracker.teacher_id ?? '',
        },
        {
          label: 'Program Type',
          value: tracker.program_type ?? '',
        },
        {
          label: 'School Name',
          value: tracker.school_name ?? '',
        },
        {
          label: 'Tracker Session Type',
          value: tracker.tracker_session_type ?? '',
        },
        {
          label: 'Session Date',
          value: tracker.session_date ? format(new Date(tracker.session_date), 'PPP') : '',
        },
        {
          label: 'Duration',
          value: `${tracker.session_duration ?? ''} min`,
        },
      ],
    },
    {
      title: 'Session Details',
      data: [
        {
          label: 'Sub Session',
          value: tracker.sub_session ?? '',
        },
        {
          label: 'Batch Year',
          value: tracker.batch_year ?? '',
        },
        {
          label: 'Grade',
          value: tracker.grade ?? '',
        },
        {
          label: 'Subject',
          value: tracker.subject ?? '',
        },
        {
          label: 'Chapter',
          value: tracker.chapter ?? '',
        },
        {
          label: 'Topics',
          value: Array.isArray(tracker.topic) ? tracker.topic.join(', ') : '',
        },
      ],
    },
    {
      title: 'Status',
      data: [
        {
          label: 'Created At',
          value: tracker.inserted_at ? format(new Date(tracker.inserted_at), 'PPP') : '',
        },
      ],
    },
  ];
};
