import {
  ActiveDaysOptions,
  CourseOptions,
  GradeOptions,
  OptionalLimitOptions,
  SessionTypeOptions,
  StreamOptions,
  TestFormatOptions,
  TestPlatformOptions,
  TestPurposeOptions,
  TestTypeOptions,
  GurukulFormatOptions,
} from '@/Constants';
import { absoluteLink } from '@/lib/utils';
import { isBefore } from 'date-fns';
import { z } from 'zod';
import { Platform } from './enums';

export const basicSchema = z
  .object({
    group: z.string({ required_error: 'This field is required' }).min(1, 'This field is required'),
    parentBatch: z.string().optional(),
    subBatch: z.array(z.string()).optional(),
    grade: z.coerce
      .number({
        required_error: 'This field is required',
        invalid_type_error: 'This field is required',
      })
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
    authType: z.string({ required_error: 'This field is required' }).optional().nullable(),
    activateSignUp: z.coerce.boolean(),
    isPopupForm: z.coerce.boolean(),
    noOfFieldsInPopup: z.coerce
      .number({
        required_error: 'This field is required',
        invalid_type_error: 'This is not a valid number',
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
    name: z.string({ required_error: 'This field is required' }).min(1, 'This field is required'),
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

    // Validation for sessions with Redirection = true
    if (data.isRedirection) {
      if (!data.authType) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'This field is required',
          path: ['authType'],
        });
      }
    }

    if (data.platform === Platform.Quiz) {
      // Quiz platform validation
      if (!data.parentBatch) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'This field is required',
          path: ['parentBatch'],
        });
      }
    } else {
      // Live platform validation
      if (!data.subBatch?.length) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'This field is required',
          path: ['subBatch'],
        });
      }
    }
  });

export const quizSchema = z
  .object({
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
    cmsUrl: z.string().optional(),
    sheetName: z.string().optional(),
    singlePageHeaderText: z.string().optional(),
    testType: z
      .string({ required_error: 'This field is required' })
      .refine(
        (value) => TestTypeOptions.some((option) => option.value === value),
        'Invalid option selected'
      ),
    gurukulFormatType: z
      .string({ required_error: 'This field is required' })
      .refine(
        (value) => GurukulFormatOptions.some((option) => option.value === value),
        'Invalid option selected'
      ),
    markingScheme: z.string().optional(),
    optionalLimit: z
      .string({ required_error: 'This field is required' })
      .refine(
        (value) => OptionalLimitOptions.some((option) => option.value === value),
        'Invalid option selected'
      ),
    showAnswers: z.coerce.boolean(),
    showScores: z.coerce.boolean(),
    shuffle: z.coerce.boolean(),
    hasNextStep: z.coerce.boolean(),
    nextStepUrl: z.string().optional(),
    nextStepText: z.string().optional(),
  })
  .superRefine((data, context) => {
    // CMS URL or Google Sheets link is required for all test types
    if (!data.cmsUrl || data.cmsUrl.trim() === '') {
      const fieldLabel = data.testType === 'form' ? 'Google Sheets link' : 'CMS URL';
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${fieldLabel} is required`,
        path: ['cmsUrl'],
      });
    } else {
      // Conditional validation based on test type
      if (data.testType === 'form') {
        // For forms, validate Google Sheets URL
        try {
          const url = new URL(data.cmsUrl);
          if (!data.cmsUrl.includes('docs.google.com/spreadsheets')) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Please provide a valid Google Sheets link',
              path: ['cmsUrl'],
            });
          }
        } catch {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please provide a valid Google Sheets link',
            path: ['cmsUrl'],
          });
        }
      } else {
        // For non-forms, validate CMS URL format
        try {
          const url = new URL(data.cmsUrl);
          if (!data.cmsUrl.includes('cms.peerlearning.com')) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Please provide a valid CMS URL (https://cms.peerlearning.com)',
              path: ['cmsUrl'],
            });
          }
        } catch {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please provide a valid CMS URL',
            path: ['cmsUrl'],
          });
        }
      }
    }

    // hasNextStep validation
    if (data.hasNextStep) {
      if (!data.nextStepUrl || data.nextStepUrl.trim() === '') {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Next step URL is required when next step is enabled',
          path: ['nextStepUrl'],
        });
      }
      if (!data.nextStepText || data.nextStepText.trim() === '') {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Next step text is required when next step is enabled',
          path: ['nextStepText'],
        });
      }
    }
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
    sessionPattern: z
      .string({
        required_error: 'Session pattern is required',
      })
      .refine((value) => ['continuous', 'weekly'].includes(value), 'Invalid session pattern'),
    activeDays: z
      .array(
        z
          .number({ required_error: 'This field is required' })
          .refine(
            (value) => ActiveDaysOptions.some((option) => option.value === value),
            'Invalid option selected'
          )
      )
      .optional(),
    testTakers: z.coerce
      .number({
        required_error: 'This field is required',
        message: 'This is not a valid number',
      })
      .int()
      .min(0, 'Test Takers must be greater than 0'),
  })
  .superRefine((data, context) => {
    // Validate that activeDays is provided for weekly session pattern
    if (data.sessionPattern === 'weekly' && (!data.activeDays || data.activeDays.length === 0)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Active days are required for weekly session pattern',
        path: ['activeDays'],
      });
    }

    const startDateTime = new Date(data.startDate);
    const endDateTime = new Date(data.endDate);

    if (data.sessionPattern === 'continuous') {
      // For continuous sessions, validate full datetime (date + time)
      if (isBefore(endDateTime, startDateTime)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'End date and time must be after start date and time.',
          path: ['endDate'],
        });
      }
    } else if (data.sessionPattern === 'weekly') {
      // For weekly sessions, validate that end time > start time (same day comparison)
      const startTime = startDateTime.toTimeString();
      const endTime = endDateTime.toTimeString();

      if (endTime <= startTime) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'End time must be greater than start time.',
          path: ['endDate'],
        });
      }

      // Also validate that end date >= start date for weekly sessions
      if (isBefore(endDateTime.toDateString(), startDateTime.toDateString())) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'End date must be greater than or equal to start date.',
          path: ['endDate'],
        });
      }
    }
  });

export const liveSchema = z
  .object({
    platformLink: z
      .string({ required_error: 'This field is required' })
      .transform((value) => (value.trim() ? absoluteLink(value) : ''))
      .pipe(z.string().url('This is not a valid url')),
    platformId: z.string({ required_error: 'This field is required' }),
    subject: z.array(z.string()).min(1, 'This field is required'),
    platform: z.string().optional().nullable(),
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
