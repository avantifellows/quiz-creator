import {
  AuthOptions,
  CourseOptions,
  GradeOptions,
  OptionalLimitOptions,
  SessionTypeOptions,
  StreamOptions,
  TestFormatOptions,
  TestPurposeOptions,
  TestTypeOptions,
  GurukulFormatOptions,
} from '@/Constants';
import { AuthType, Group, Platform, Subjects } from '@/types';
import { buildBatchLabel } from '@/lib/batch-options';
import { getDateWithTime } from '../support/utils';

/**
 * Batch fixture. The dropdown label is derived with the same helper the app uses
 * (`name (batch_id)`), so fixtures stay correct if the label format changes.
 */
const batchFixture = (batchId: string, name: string) => ({
  label: buildBatchLabel(name, batchId),
  value: batchId,
  name,
});

// Quiz Create Details
export const CreateQuizData = {
  name: 'Cypress Quiz Session',
  platform: { label: Platform.Quiz, value: Platform.Quiz },
  group: { label: Group.Haryana, value: Group.Haryana },
  // Quiz sessions can target several quiz batches; the class-batch options are the
  // union of the selected parents' children.
  parentBatch: [batchFixture('HR-9-Foundation-25', 'Haryana 9 Quiz Batch - 25')],
  subBatch: [batchFixture('HaryanaStudents_9_Foundation_25_001', '9B01 2025')],
  grade: GradeOptions.find((i) => i.value === 9)!,
  sessionType: SessionTypeOptions.find((i) => i.value === 'sign-in')!,
  authType: AuthOptions.find((i) => (i.value = AuthType.ID))!,
  noOfFieldsInPopup: '',
  activateSignUp: false,
  isPopupForm: false,
  isRedirection: true,
  isIdGeneration: false,

  // Platform Details
  course: CourseOptions.find((i) => i.value === 'Foundation')!,
  stream: StreamOptions.find((i) => i.value === 'pcmb')!,
  testFormat: TestFormatOptions.find((i) => i.value === 'mock_test')!,
  testPurpose: TestPurposeOptions.find((i) => i.value === 'one_time')!,
  testType: TestTypeOptions.find((i) => i.value === 'assessment')!,
  gurukulFormatType: GurukulFormatOptions.find((i) => i.value === 'qa')!,
  cmsUrl: 'https://cms.peerlearning.com/chapter_tests/6556f6763562d97a6300aa35',
  optionalLimit: OptionalLimitOptions.find((i) => i.value === 'N/A')!,
  showAnswers: true,
  showScores: true,
  shuffle: false,

  // Timeline Details
  startDate: getDateWithTime({ hours: 10, minutes: 0 }),
  endDate: getDateWithTime({ hours: 16, minutes: 0 }, 7),
  testTakers: '10',
  sessionPattern: 'continuous', // Quiz platforms use continuous pattern (24/7)
  isEnabled: true,
};

// Quiz Edit Details
export const PatchQuizData = {
  startDate: getDateWithTime({ hours: 11, minutes: 0 }),
  endDate: getDateWithTime({ hours: 15, minutes: 0 }, 4),
  name: 'Cypress Quiz Session Edit',
  sessionPattern: 'continuous', // Quiz platforms use continuous pattern (24/7)
};

// Quiz Duplicate Details
export const DuplicateQuizData = {
  name: 'Cypress Quiz Session Duplicate',
  testType: TestTypeOptions.find((i) => i.value === 'homework')!,
  gurukulFormatType: GurukulFormatOptions.find((i) => i.value === 'omr')!,
  cmsUrl: 'https://cms.peerlearning.com/chapter_tests/6556f6763562d97a6300aa35',
  startDate: getDateWithTime({ hours: 14, minutes: 20 }, 1),
  endDate: getDateWithTime({ hours: 15, minutes: 50 }, 3),
};

// Live Create Details
export const CreateLiveData = {
  name: 'Cypress Live Session',
  platform: { label: Platform.Youtube, value: Platform.Youtube },
  group: { label: Group.Haryana, value: Group.Haryana },
  subBatch: [
    batchFixture('HaryanaStudents_9_Foundation_25_001', '9B01 2025'),
    batchFixture('HaryanaStudents_10_Foundation_25_001', '10B01 2025'),
  ],
  grade: GradeOptions.find((i) => i.value === 9)!,
  sessionType: SessionTypeOptions.find((i) => i.value === 'sign-in')!,
  authType: AuthOptions.find((i) => (i.value = AuthType.ID))!,
  noOfFieldsInPopup: '',
  activateSignUp: false,
  isPopupForm: false,
  isRedirection: true,
  isIdGeneration: false,

  // Platform Details
  platformLink: 'https://www.youtube.com/live/jfKfPfyJRdk',
  platformId: 'jfKfPfyJRdk',
  subject: [Subjects.Maths, Subjects.Physics].map((i) => ({ label: i, value: i })),

  // Timeline Details
  startDate: getDateWithTime({ hours: 10, minutes: 0 }),
  endDate: getDateWithTime({ hours: 16, minutes: 0 }, 7),
  testTakers: '10',
  sessionPattern: 'weekly', // Live sessions use weekly pattern (specific days)
  activeDays: [1, 2, 3, 4, 5],
  isEnabled: true,
};

// Live Edit Details
export const PatchLiveData = {
  startDate: getDateWithTime({ hours: 8, minutes: 0 }),
  endDate: getDateWithTime({ hours: 20, minutes: 0 }, 4),
  name: 'Cypress Live Session Edit',
  sessionPattern: 'weekly',
  activeDays: [1, 2, 3, 4, 5, 6, 7],
};

// Live Duplicate Details
export const DuplicateLiveData = {
  name: 'Cypress Live Session Duplicate',
  platformLink: 'https://www.youtube.com/watch?v=K4TOrB7at0Y',
  platformId: 'K4TOrB7at0Y',
  startDate: getDateWithTime({ hours: 14, minutes: 20 }, 1),
  endDate: getDateWithTime({ hours: 15, minutes: 50 }, 3),
  sessionPattern: 'weekly',
  activeDays: [1, 3, 5],
};
