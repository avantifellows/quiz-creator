import { addDays } from 'date-fns';

// Mock Data which is filled during test
export const MockQuizData = {
  create: {
    // Basic Details
    name: 'Cypress Session',
    platform: { label: 'quiz', value: 'quiz' },
    group: { label: 'HaryanaStudents', value: 'HaryanaStudents' },
    parentBatch: { label: 'HR-9-Foundation-24', value: 'HR-9-Foundation-24' },
    subBatch: [
      {
        label: 'HaryanaStudents_9_Foundation_24_001',
        value: 'HaryanaStudents_9_Foundation_24_001',
      },
    ],
    grade: { label: '9', value: '9' },
    sessionType: { label: 'SignIn', value: 'sign-in' },
    authType: { label: 'ID', value: 'ID' },
    noOfFieldsInPopup: '',
    activateSignUp: false,
    isPopupForm: false,
    isRedirection: true,
    isIdGeneration: false,

    // Platform Details
    course: { value: 'Foundation', label: 'Foundation' },
    stream: { value: 'pcmb', label: 'PCMB' },
    testFormat: { value: 'mock_test', label: 'Mock Test' },
    testPurpose: { value: 'one_time', label: 'One Time Test' },
    testType: { value: 'assessment', label: 'Assessment' },
    cmsUrl: 'https://cms.peerlearning.com/chapter_tests/6556f6763562d97a6300aa35',
    optionalLimit: { value: 'N/A', label: 'N/A' },
    showAnswers: false,

    // Timeline Details
    startDate: new Date(),
    endDate: addDays(new Date(), 7),
    testTakers: '10',
    activeDays: [1, 2, 3, 4, 5, 6, 7],
    isEnabled: true,
  },
  edit: {
    startDate: new Date(),
    endDate: addDays(new Date(), 3),
    name: 'Cypress Session Edit',
  },
};

export const MockYoutubeData = {};
