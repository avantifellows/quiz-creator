import { AuthType, Grades, Option, Platform, Subjects } from '@/types';

export const TestTypeOptions: Option[] = [
  { value: 'assessment', label: 'Assessment' },
  { value: 'homework', label: 'Homework' },
  { value: 'omr-assessment', label: 'Omr-Assessment' },
];

export const SessionTypeOptions: Option[] = [
  { value: 'sign-in', label: 'SignIn' },
  { value: 'sign-up', label: 'SignUp' },
  { value: 'sign-in with forgot id', label: 'SignIn with Forgot ID' },
];

export const TestFormatOptions: Option[] = [
  { value: 'part_test', label: 'Part Test' },
  { value: 'major_test', label: 'Major Test' },
  { value: 'full_syllabus_test', label: 'Full Syllabus Test' },
  { value: 'evaluation_test', label: 'Evaluation Test' },
  { value: 'hiring_test', label: 'Hiring Test' },
  { value: 'homework', label: 'Homework' },
];

export const TestPurposeOptions: Option[] = [
  { value: 'baseline', label: 'Baseline' },
  { value: 'endline', label: 'Endline' },
  { value: 'weekly_test', label: 'Weekly Test' },
  { value: 'monthly_test', label: 'Monthly Test' },
  { value: 'reshuffling_test', label: 'Reshuffling Test' },
  { value: 'selection_test', label: 'Selection Test' },
  { value: 'one_time_test', label: 'One Time Test' },
];

export const TestPlatformOptions = Object.values(Platform).map((value) => ({
  value: value.toString(),
  label: value.toString(),
}));

export const MarkingSchemeOptions: Option[] = [
  { value: '4,-1', label: '4,-1' },
  { value: '1,0', label: '1,0' },
];

export const OptionalLimitOptions: Option[] = [
  { value: 'NA', label: 'NA' },
  { value: 'neet', label: 'NEET' },
  { value: 'jee', label: 'JEE' },
  { value: 'cuet', label: 'CUET' },
];

export const CourseOptions: Option[] = [
  { value: 'NEET', label: 'NEET' },
  { value: 'Catalyst', label: 'Catalyst' },
  { value: 'Alpha', label: 'Alpha' },
  { value: 'Hiring', label: 'Hiring' },
  { value: 'Certification', label: 'Certification' },
  { value: 'Foundation', label: 'Foundation' },
  { value: 'Photon', label: 'Photon' },
];

export const StreamOptions: Option[] = [
  { value: 'Medical', label: 'Medical' },
  { value: 'Maths', label: 'Maths' },
  { value: 'Science', label: 'Science' },
  { value: 'Physics', label: 'Physics' },
  { value: 'Chemistry', label: 'Chemistry' },
  { value: 'PCMB', label: 'PCMB' },
  { value: 'Botany', label: 'Botany' },
  { value: 'PCMBA', label: 'PCMBA' },
  { value: 'Zoology', label: 'Zoology' },
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
