import {
  BatchOptions,
  CourseOptions,
  GradeOptions,
  GroupOptions,
  StreamOptions,
} from '@/Constants/StudentDetailsOptions';
import {
  MarkingSchemeOptions,
  OptionalLimitOptions,
  TestFormatOptions,
  TestPlatformOptions,
  TestPurposeOptions,
  TestTypeOptions,
} from '@/Constants/TestDetailsOptions';
import {
  HasSyncedOptions,
  IsEnabledOptions,
  SessionTypeOptions,
} from '@/Constants/TimelineOptions';
import { z } from 'zod';

export const basicSchema = z.object({
  group: z
    .string({ required_error: 'This field is required' })
    .refine(
      (value) => GroupOptions.some((option) => option.value === value),
      'Invalid option selected'
    ),
  batch: z
    .string({ required_error: 'This field is required' })
    .refine(
      (value) => BatchOptions.some((option) => option.value === value),
      'Invalid option selected'
    ),
  grade: z
    .string({ required_error: 'This field is required' })
    .refine(
      (value) => GradeOptions.some((option) => option.value === value),
      'Invalid option selected'
    ),
  course: z
    .string({ required_error: 'This field is required' })
    .refine(
      (value) => CourseOptions.some((option) => option.value === value),
      'Invalid option selected'
    ),
  stream: z
    .string({ required_error: 'This field is required' })
    .refine(
      (value) => StreamOptions.some((option) => option.value === value),
      'Invalid option selected'
    ),
  testTakers: z.coerce
    .number({ required_error: 'This field is required' })
    .int()
    .min(0, 'Test Takers must be greater than 0'),
});

export const quizSchema = z.object({
  name: z.string({ required_error: 'This field is required' }),
  testType: z
    .string({ required_error: 'This field is required' })
    .refine(
      (value) => TestTypeOptions.some((option) => option.value === value),
      'Invalid option selected'
    ),
  testFormat: z
    .string({ required_error: 'This field is required' })
    .refine(
      (value) => TestFormatOptions.some((option) => option.value === value),
      'Invalid option selected'
    ),
  testPurpose: z
    .string({ required_error: 'This field is required' })
    .refine(
      (value) => TestPurposeOptions.some((option) => option.value === value),
      'Invalid option selected'
    ),
  testPlatform: z
    .string({ required_error: 'This field is required' })
    .refine(
      (value) => TestPlatformOptions.some((option) => option.value === value),
      'Invalid option selected'
    ),
  markingScheme: z
    .string({ required_error: 'This field is required' })
    .refine(
      (value) => MarkingSchemeOptions.some((option) => option.value === value),
      'Invalid option selected'
    ),
  optionalLimit: z
    .string({ required_error: 'This field is required' })
    .refine(
      (value) => OptionalLimitOptions.some((option) => option.value === value),
      'Invalid option selected'
    ),
  id: z.number().optional(),
  sessionId: z.string().optional(),
  sessionLink: z.string().url('This is not a valid url').optional(),
  cmsId: z.string({ required_error: 'This field is required' }).url('This is not a valid url'),
});

export const timelineSchema = z.object({
  startDate: z.date({
    required_error: 'This field is required',
    message: 'This is not a valid date',
  }),
  startTime: z
    .string({ required_error: 'This field is required' })
    .time('This is not a valid time'),
  endDate: z.date({
    required_error: 'This field is required',
    message: 'This is not a valid date',
  }),
  endTime: z.string({ required_error: 'This field is required' }).time('This is not a valid time'),
  isEnabled: z
    .string({ required_error: 'This field is required' })
    .refine(
      (value) => IsEnabledOptions.some((option) => option.value === value),
      'Invalid option selected'
    ),
  sessionType: z
    .string({ required_error: 'This field is required' })
    .refine(
      (value) => SessionTypeOptions.some((option) => option.value === value),
      'Invalid option selected'
    ),
  has_synced_to_bq: z
    .string()
    .refine(
      (value) => HasSyncedOptions.some((option) => option.value === value),
      'Invalid option selected'
    )
    .optional(),
  repeatSchedule: z.string().optional(),
  reportLink: z.string().url('This is not a valid url').optional(),
});

export const liveSchema = z.object({});

export type basicFields = z.infer<typeof basicSchema>;
export type quizFields = z.infer<typeof quizSchema>;
export type liveFields = z.infer<typeof liveSchema>;
export type timelineFields = z.infer<typeof timelineSchema>;
