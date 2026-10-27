/*
 * PROTOTYPE sample data for the Forms list. There is no form backend yet (decisions D10/D14:
 * definitions will live in quiz-backend's `form_definitions`); these rows only let the list,
 * details panel and row actions be reviewed. Replace with a quiz-backend call.
 */

export interface FormSessionRef {
  id: number;
  name: string;
}

/** What the Forms list needs per form (the real API returns this from `form_definitions`). */
export interface FormSummary {
  id: string;
  title: string;
  languages: ('en' | 'hi')[];
  questionCount: number;
  conditionalCount: number;
  /** Set when the first session is created from the form; a locked form can't be edited. */
  lockedAt: string | null;
  sessions: FormSessionRef[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const SAMPLE_FORMS: FormSummary[] = [
  {
    id: '6b1f0c2a9e4d3a0012ab34cd',
    title: 'Grade 12 Mentorship Screener',
    languages: ['en', 'hi'],
    questionCount: 28,
    conditionalCount: 4,
    lockedAt: '2026-10-20T06:30:00Z',
    sessions: [
      { id: 20311, name: 'G12 Mentorship Screener – Cycle 1' },
      { id: 20342, name: 'G12 Mentorship Screener – Cycle 1 (late joiners)' },
    ],
    createdBy: 'abhinavgupta@avantifellows.org',
    createdAt: '2026-10-14T09:10:00Z',
    updatedAt: '2026-10-19T11:45:00Z',
  },
  {
    id: '6b1f0c2a9e4d3a0012ab34ce',
    title: 'Grade 12 Mentorship Screener (copy)',
    languages: ['en', 'hi'],
    questionCount: 29,
    conditionalCount: 4,
    lockedAt: null,
    sessions: [],
    createdBy: 'abhinavgupta@avantifellows.org',
    createdAt: '2026-10-27T08:00:00Z',
    updatedAt: '2026-10-28T05:20:00Z',
  },
  {
    id: '6b1f0c2a9e4d3a0012ab34cf',
    title: 'Parent Feedback 2026',
    languages: ['en'],
    questionCount: 12,
    conditionalCount: 0,
    lockedAt: '2026-09-02T10:00:00Z',
    sessions: [
      { id: 19870, name: 'Parent Feedback – Sept 2026' },
      { id: 19871, name: 'Parent Feedback – Sept 2026 (Hindi batches)' },
      { id: 20105, name: 'Parent Feedback – Oct 2026' },
    ],
    createdBy: 'poojita@avantifellows.org',
    createdAt: '2026-08-28T07:30:00Z',
    updatedAt: '2026-09-01T12:00:00Z',
  },
  {
    id: '6b1f0c2a9e4d3a0012ab34d0',
    title: 'Hostel Life Survey (draft)',
    languages: ['en', 'hi'],
    questionCount: 7,
    conditionalCount: 2,
    lockedAt: null,
    sessions: [],
    createdBy: 'poojita@avantifellows.org',
    createdAt: '2026-10-25T06:00:00Z',
    updatedAt: '2026-10-26T13:15:00Z',
  },
];

export const findSampleForm = (id: string | undefined): FormSummary | undefined =>
  SAMPLE_FORMS.find((f) => f.id === id);
