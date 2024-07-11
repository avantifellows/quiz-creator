import {
  ActiveDaysOptions,
  CourseOptions,
  GradeOptions,
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
import { Platform } from './enums';

export const basicSchema = z
  .object({
    group: z.string({ required_error: 'This field is required' }).min(1, 'This field is required'),
    parentBatch: z
      .string({ required_error: 'This field is required' })
      .min(1, 'This field is required'),
    subBatch: z.string({ required_error: 'This field is required' }),
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
      .min(0)
      .or(z.string().nullable()),
    isRedirection: z.coerce.boolean(),
    isIdGeneration: z.coerce.boolean(),
    signupFormId: z.coerce.number().optional().nullable(),
    popupFormId: z.coerce.number().optional().nullable(),
    platform: z
      .string({ required_error: 'This field is required' })
      .refine(
        (value) => TestPlatformOptions.some((option) => option.value === value),
        'Invalid option selected'
      ),
    name: z.string({ required_error: 'This field is required' }),
  })
  .superRefine((data, context) => {
    if (data.isPopupForm) {
      if (!data.noOfFieldsInPopup) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'This field is required',
          path: ['noOfFieldsInPopup'],
        });
      }
      if (!data.popupFormId) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'This field is required',
          path: ['popupFormId'],
        });
      }
    }

    if (data.activateSignUp) {
      if (!data.signupFormId) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'This field is required',
          path: ['signupFormId'],
        });
      }
    }
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
  cmsUrl: z
    .string({ required_error: 'This field is required' })
    .url('This is not a valid url')
    .includes('cms.peerlearning.com', {
      message: 'This is not a valid cms url, please use https://cms.peerlearning.com',
    }),
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
  showAnswers: z.coerce.boolean(),
});

export const timelineSchema = z
  .object({
    startDate: z.coerce
      .date({
        required_error: 'This field is required',
        message: 'This is not a valid date and time',
      })
      .or(z.string()),
    endDate: z.coerce
      .date({
        required_error: 'This field is required',
        message: 'This is not a valid date and time',
      })
      .or(z.string()),
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
  })
  .refine((data) => data.startDate < data.endDate, {
    message: 'End date must be greater than start date.',
    path: ['endDate'],
  });

export const liveSchema = z
  .object({
    platformLink: z
      .string({ required_error: 'This field is required' })
      .url('This is not a valid url'),
    platformId: z.string({ required_error: 'This field is required' }),
    subject: z.string({ required_error: 'This field is required' }),
    platform: z.string().optional(),
  })
  .refine(
    (data) => {
      if (Platform.Meet === data.platform) {
        return data.platformLink.includes('meet.google.com');
      } else if (Platform.Zoom === data.platform) {
        return data.platformLink.includes('zoom.us');
      } else if (Platform.Youtube === data.platform) {
        return data.platformLink.includes('youtube.com');
      } else if (Platform.Plio === data.platform || Platform.SPlio === data.platform) {
        return data.platformLink.includes('plio.in');
      } else {
        return true;
      }
    },
    (data) => ({
      message: `Platform link is not valid for ${data.platform}`,
      path: ['platformLink'],
    })
  );

export type basicFields = z.infer<typeof basicSchema>;
export type quizFields = z.infer<typeof quizSchema>;
export type liveFields = z.infer<typeof liveSchema>;
export type timelineFields = z.infer<typeof timelineSchema>;
