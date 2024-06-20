import {
  ActiveDaysOptions,
  BatchOptions,
  CourseOptions,
  GradeOptions,
  GroupOptions,
  MarkingSchemeOptions,
  OptionalLimitOptions,
  SessionTypeOptions,
  StreamOptions,
  TestFormatOptions,
  TestPlatformOptions,
  TestPurposeOptions,
  TestTypeOptions,
} from '@/Constants';
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
  grade: z.coerce
    .number({ required_error: 'This field is required' })
    .refine(
      (value) => GradeOptions.some((option) => option.value === value),
      'Invalid option selected'
    ),
  sessionType: z
    .string({ required_error: 'This field is required' })
    .refine(
      (value) => SessionTypeOptions.some((option) => option.value === value),
      'Invalid option selected'
    ),
  authType: z.string({ required_error: 'This field is required' }),
  activateSignUp: z.coerce.boolean(),
  isPopupForm: z.coerce.boolean(),
  noOfFieldsInPopup: z.coerce
    .number({
      required_error: 'This field is required',
      message: 'This is not a valid number',
    })
    .int()
    .min(0),
  isRedirection: z.coerce.boolean(),
  isIdGeneration: z.coerce.boolean(),
  // signupFormName: z.string({ required_error: 'This field is required' }),
  platform: z
    .string({ required_error: 'This field is required' })
    .refine(
      (value) => TestPlatformOptions.some((option) => option.value === value),
      'Invalid option selected'
    ),
});

export const quizSchema = z.object({
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
  cmsUrl: z.string({ required_error: 'This field is required' }).url('This is not a valid url'),
  name: z.string({ required_error: 'This field is required' }),
  testType: z
    .string({ required_error: 'This field is required' })
    .refine(
      (value) => TestTypeOptions.some((option) => option.value === value),
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
});

export const timelineSchema = z.object({
  startDate: z.coerce
    .date({
      required_error: 'This field is required',
      message: 'This is not a valid date and time',
    })
    .min(new Date(), 'Start date cannot be in the past'),
  endDate: z.coerce
    .date({
      required_error: 'This field is required',
      message: 'This is not a valid date and time',
    })
    .min(new Date(), 'End date cannot be in the past'),
  isEnabled: z.coerce.boolean(),
  activeDays: z.array(
    z
      .number({ required_error: 'This field is required' })
      .refine(
        (value) => ActiveDaysOptions.some((option) => option.value === value),
        'Invalid option selected'
      )
  ),
  testTakers: z.coerce
    .number({
      required_error: 'This field is required',
      message: 'This is not a valid number',
    })
    .int()
    .min(0, 'Test Takers must be greater than 0'),
});

export const liveSchema = z.object({
  platformLink: z
    .string({ required_error: 'This field is required' })
    .url('This is not a valid url'),
  name: z.string({ required_error: 'This field is required' }),
});

export type basicFields = z.infer<typeof basicSchema>;
export type quizFields = z.infer<typeof quizSchema>;
export type liveFields = z.infer<typeof liveSchema>;
export type timelineFields = z.infer<typeof timelineSchema>;
