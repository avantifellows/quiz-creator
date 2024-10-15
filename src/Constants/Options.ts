import { AuthType, Grades, MARKING_SCHEMES, Option, Platform, Subjects } from '@/types';

export const TestTypeOptions: Option[] = [
  { value: 'assessment', label: 'Assessment' },
  { value: 'homework', label: 'Homework' },
  { value: 'omr-assessment', label: 'Omr-Assessment' },
];

export const SessionTypeOptions: Option[] = [
  { value: 'sign-in', label: 'SignIn' },
  { value: 'sign-up', label: 'SignUp' },
  // Removed as now we are not allowing forgot id
  // { value: 'sign-in with forgot id', label: 'SignIn with Forgot ID' },
  { value: 'broadcast', label: 'Broadcast' },
];

export const TestFormatOptions: Option[] = [
  { value: 'part_test', label: 'Part Test' },
  { value: 'major_test', label: 'Major Test' },
  { value: 'chapter_test', label: 'Chapter Test' },
  { value: 'full_syllabus_test', label: 'Full Syllabus Test' },
  { value: 'evaluation_test', label: 'Evaluation Test' },
  { value: 'hiring_test', label: 'Hiring Test' },
  { value: 'mock_test', label: 'Mock Test' },
  { value: 'homework', label: 'Homework' },
];

export const TestPurposeOptions: Option[] = [
  { value: 'baseline', label: 'Baseline' },
  { value: 'endline', label: 'Endline' },
  { value: 'weekly_test', label: 'Weekly Test' },
  { value: 'monthly_test', label: 'Monthly Test' },
  { value: 'reshuffling_test', label: 'Reshuffling Test' },
  { value: 'selection_test', label: 'Selection Test' },
  { value: 'one_time', label: 'One Time Test' },
  { value: 'practice_test', label: 'Practice Test' },
  { value: 'class_hw', label: 'Class Homework' },
  { value: 'assignment', label: 'Assignment' },
];

export const TestPlatformOptions = Object.values(Platform).map((value) => ({
  value: value.toString(),
  label: value.toString(),
}));

export const MarkingSchemeOptions: Option[] = Object.values(MARKING_SCHEMES).map((value) => ({
  value: value.toString(),
  label: value.toString(),
}));

export const OptionalLimitOptions: Option[] = [
  { value: 'N/A', label: 'N/A' },
  { value: 'NEET', label: 'NEET' },
  { value: 'JEE', label: 'JEE' },
  { value: 'CUET', label: 'CUET' },
  { value: 'NA', label: 'NA' },
];

export const CourseOptions: Option[] = [
  { value: 'NEET', label: 'NEET' },
  { value: 'Catalyst', label: 'Catalyst' },
  { value: 'Alpha', label: 'Alpha' },
  { value: 'Hiring', label: 'Hiring' },
  { value: 'Certification', label: 'Certification' },
  { value: 'Foundation', label: 'Foundation' },
  { value: 'Photon', label: 'Photon' },
  { value: 'JEE', label: 'JEE' },
  { value: 'CUET', label: 'CUET' },
];

export const StreamOptions: Option[] = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'medical', label: 'Medical' },
  { value: 'maths', label: 'Maths' },
  { value: 'science', label: 'Science' },
  { value: 'physics', label: 'Physics' },
  { value: 'chemistry', label: 'Chemistry' },
  { value: 'biology', label: 'Biology' },
  { value: 'pcmb', label: 'PCMB' },
  { value: 'botany', label: 'Botany' },
  { value: 'zoology', label: 'Zoology' },
  { value: 'pcmba', label: 'PCMBA' },
  { value: 'tbd', label: 'TBD' },
  { value: 'business_studies', label: 'Business Studies' },
  { value: 'economics', label: 'Economics' },
];

export const GradeOptions = Grades.map((g) => ({ value: Number(g), label: g.toString() }));

export const AuthOptions: Option[] = Object.values(AuthType).map((item) => ({
  value: item,
  label: item,
}));

export const SubjectOptions = Object.values(Subjects).map((s) => ({ value: s, label: s }));

export const ActiveDaysOptions: Option[] = [
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
  { label: 'Sunday', value: 7 },
];
