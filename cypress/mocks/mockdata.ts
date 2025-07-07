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
import { getDateWithTime } from '../support/utils';

// Quiz Create Details
export const CreateQuizData = {
  name: 'Cypress Quiz Session',
  platform: { label: Platform.Quiz, value: Platform.Quiz },
  group: { label: Group.Haryana, value: Group.Haryana },
  parentBatch: {
    label: 'HR-9-Foundation-24',
    value: 'HR-9-Foundation-24',
    name: 'Haryana 9 Quiz Batch - 24',
  },
  subBatch: [
    {
      label: 'HaryanaStudents_9_Foundation_24_001',
      value: 'HaryanaStudents_9_Foundation_24_001',
      name: '9B01',
    },
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
  activeDays: [1, 2, 3, 4, 5],
  isEnabled: true,
};

// Quiz Edit Details
export const PatchQuizData = {
  startDate: getDateWithTime({ hours: 11, minutes: 0 }),
  endDate: getDateWithTime({ hours: 15, minutes: 0 }, 4),
  name: 'Cypress Quiz Session Edit',
  activeDays: [1, 2, 3, 4, 5, 6, 7],
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
    {
      label: 'HaryanaStudents_9_Foundation_24_001',
      value: 'HaryanaStudents_9_Foundation_24_001',
      name: '9B01',
    },
    {
      label: 'HaryanaStudents_10_Foundation_24_001',
      value: 'HaryanaStudents_10_Foundation_24_001',
      name: '10B01',
    },
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
  activeDays: [1, 2, 3, 4, 5],
  isEnabled: true,
};

// Live Edit Details
export const PatchLiveData = {
  startDate: getDateWithTime({ hours: 8, minutes: 0 }),
  endDate: getDateWithTime({ hours: 20, minutes: 0 }, 4),
  name: 'Cypress Live Session Edit',
  activeDays: [1, 2, 3, 4, 5, 6, 7],
};

// Live Duplicate Details
export const DuplicateLiveData = {
  name: 'Cypress Live Session Duplicate',
  platformLink: 'https://www.youtube.com/watch?v=K4TOrB7at0Y',
  platformId: 'K4TOrB7at0Y',
  startDate: getDateWithTime({ hours: 14, minutes: 20 }, 1),
  endDate: getDateWithTime({ hours: 15, minutes: 50 }, 3),
  activeDays: [1, 3, 5],
};
