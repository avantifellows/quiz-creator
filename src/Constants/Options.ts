import { Option } from '@/types';

export const TestTypeOptions: Option[] = [
  { value: 'assessment', label: 'Assessment' },
  { value: 'homework', label: 'Homework' },
  { value: 'omr-assessment', label: 'Omr-Assessment' },
];

export const SessionTypeOptions: Option[] = [
  { value: 'sign-in', label: 'SignIn' },
  { value: 'sign-up', label: 'SignUp' },
  { value: 'sign-in with forgot id', label: 'SignIn with forgot id' },
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

export const TestPlatformOptions = [
  { value: 'quiz', label: 'Quiz' },
  { value: 'live', label: 'Live Class' },
];

export const MarkingSchemeOptions: Option[] = [
  { value: '4,-1', label: '4 , -1' },
  { value: '1,0', label: '1, 0' },
];

export const OptionalLimitOptions: Option[] = [
  { value: 'NA', label: 'NA' },
  { value: 'neet', label: 'NEET' },
  { value: 'jee', label: 'JEE' },
  { value: 'cuet', label: 'CUET' },
];

export const GroupOptions: Option[] = [
  { value: 'HaryanaStudents', label: 'Haryana Students' },
  { value: 'HimachalStudents', label: 'Himachal Students' },
  { value: 'DelhiStudents', label: 'Delhi Students' },
  { value: 'EnableStudents', label: 'Enable Students' },
  { value: 'AFTeachers', label: 'AF Teachers' },
  { value: 'Candidates', label: 'Candidates' },
  { value: 'GujaratStudents', label: 'Gujarat Students' },
  { value: 'AFTesting', label: 'AF Testing' },
];

export const BatchOptions: Option[] = [
  { value: 'DL-12-Alpha-Eng-23', label: 'DL-12-Alpha-Eng-23' },
  { value: 'DL-12-Photon-Eng-23', label: 'DL-12-Photon-Eng-23' },
  { value: 'DL-12-Catalyst-Eng-23', label: 'DL-12-Catalyst-Eng-23' },
  { value: 'DL-12-Alpha-med-23', label: 'DL-12-Alpha-med-23' },
  { value: 'DL-12-Photon-med-23', label: 'DL-12-Photon-med-23' },
  { value: 'DL-12-Catalyst-med-23', label: 'DL-12-Catalyst-med-23' },
  { value: 'DL-11-Alpha-med-23', label: 'DL-11-Alpha-med-23' },
  { value: 'DL-11-Photon-med-23', label: 'DL-11-Photon-med-23' },
  { value: 'DL-11-Catalyst-med-23', label: 'DL-11-Catalyst-med-23' },
  { value: 'DL-11-Alpha-eng-23', label: 'DL-11-Alpha-eng-23' },
  { value: 'DL-11-Photon-eng-23', label: 'DL-11-Photon-eng-23' },
  { value: 'DL-11-Catalyst-eng-23', label: 'DL-11-Catalyst-eng-23' },
  { value: 'DL-12-Alpha-Eng-22', label: 'DL-12-Alpha-Eng-22' },
  { value: 'DL-12-Photon-Eng-22', label: 'DL-12-Photon-Eng-22' },
  { value: 'DL-12-Catalyst-Eng-22', label: 'DL-12-Catalyst-Eng-22' },
  { value: 'DL-12-Alpha-med-22', label: 'DL-12-Alpha-med-22' },
  { value: 'DL-12-Photon-med-22', label: 'DL-12-Photon-med-22' },
  { value: 'DL-12-Catalyst-med-22', label: 'DL-12-Catalyst-med-22' },
  { value: 'DL-11-Alpha-med-22', label: 'DL-11-Alpha-med-22' },
  { value: 'DL-11-Photon-med-22', label: 'DL-11-Photon-med-22' },
  { value: 'DL-11-Catalyst-med-22', label: 'DL-11-Catalyst-med-22' },
  { value: 'DL-11-Alpha-eng-22', label: 'DL-11-Alpha-eng-22' },
  { value: 'DL-11-Photon-eng-22', label: 'DL-11-Photon-eng-22' },
  { value: 'DL-11-Catalyst-eng-22', label: 'DL-11-Catalyst-eng-22' },

  { value: 'HP-12-Alpha-Eng-23', label: 'HP-12-Alpha-Eng-23' },
  { value: 'HP-12-Photon-Eng-23', label: 'HP-12-Photon-Eng-23' },
  { value: 'HP-12-Catalyst-Eng-23', label: 'HP-12-Catalyst-Eng-23' },
  { value: 'HP-12-Alpha-med-23', label: 'HP-12-Alpha-med-23' },
  { value: 'HP-12-Photon-med-23', label: 'HP-12-Photon-med-23' },
  { value: 'HP-12-Catalyst-med-23', label: 'HP-12-Catalyst-med-23' },
  { value: 'HP-11-Alpha-med-23', label: 'HP-11-Alpha-med-23' },
  { value: 'HP-11-Photon-med-23', label: 'HP-11-Photon-med-23' },
  { value: 'HP-11-Catalyst-med-23', label: 'HP-11-Catalyst-med-23' },
  { value: 'HP-11-Alpha-eng-23', label: 'HP-11-Alpha-eng-23' },
  { value: 'HP-11-Photon-eng-23', label: 'HP-11-Photon-eng-23' },
  { value: 'HP-11-Catalyst-eng-23', label: 'HP-11-Catalyst-eng-23' },
  { value: 'HP-12-Alpha-Eng-22', label: 'HP-12-Alpha-Eng-22' },
  { value: 'HP-12-Photon-Eng-22', label: 'HP-12-Photon-Eng-22' },
  { value: 'HP-12-Catalyst-Eng-22', label: 'HP-12-Catalyst-Eng-22' },
  { value: 'HP-12-Alpha-med-22', label: 'HP-12-Alpha-med-22' },
  { value: 'HP-12-Photon-med-22', label: 'HP-12-Photon-med-22' },
  { value: 'HP-12-Catalyst-med-22', label: 'HP-12-Catalyst-med-22' },
  { value: 'HP-11-Alpha-med-22', label: 'HP-11-Alpha-med-22' },
  { value: 'HP-11-Photon-med-22', label: 'HP-11-Photon-med-22' },
  { value: 'HP-11-Catalyst-med-22', label: 'HP-11-Catalyst-med-22' },
  { value: 'HP-11-Alpha-eng-22', label: 'HP-11-Alpha-eng-22' },
  { value: 'HP-11-Photon-eng-22', label: 'HP-11-Photon-eng-22' },
  { value: 'HP-11-Catalyst-eng-22', label: 'HP-11-Catalyst-eng-22' },

  { value: 'GJ-12-Alpha-Eng-22', label: 'GJ-12-Alpha-Eng-22' },
  { value: 'GJ-12-Photon-Eng-22', label: 'GJ-12-Photon-Eng-22' },
  { value: 'GJ-12-Catalyst-Eng-22', label: 'GJ-12-Catalyst-Eng-22' },
  { value: 'GJ-12-Alpha-med-22', label: 'GJ-12-Alpha-med-22' },
  { value: 'GJ-12-Photon-med-22', label: 'GJ-12-Photon-med-22' },
  { value: 'GJ-12-Catalyst-med-22', label: 'GJ-12-Catalyst-med-22' },

  { value: 'EN-12-Alpha-Eng-23', label: 'EN-12-Alpha-Eng-23' },
  { value: 'EN-12-Photon-Eng-23', label: 'EN-12-Photon-Eng-23' },
  { value: 'EN-12-Catalyst-Eng-23', label: 'EN-12-Catalyst-Eng-23' },
  { value: 'EN-12-Alpha-med-23', label: 'EN-12-Alpha-med-23' },
  { value: 'EN-12-Photon-med-23', label: 'EN-12-Photon-med-23' },
  { value: 'EN-12-Catalyst-med-23', label: 'EN-12-Catalyst-med-23' },
  { value: 'EN-11-Alpha-med-23', label: 'EN-11-Alpha-med-23' },
  { value: 'EN-11-Photon-med-23', label: 'EN-11-Photon-med-23' },
  { value: 'EN-11-Catalyst-med-23', label: 'EN-11-Catalyst-med-23' },
  { value: 'EN-11-Alpha-eng-23', label: 'EN-11-Alpha-eng-23' },
  { value: 'EN-11-Photon-eng-23', label: 'EN-11-Photon-eng-23' },
  { value: 'EN-11-Catalyst-eng-23', label: 'EN-11-Catalyst-eng-23' },

  { value: 'EN-12-Photon-Eng-22', label: 'EN-12-Photon-Eng-22' },
  { value: 'EN-12-Catalyst-Eng-22', label: 'EN-12-Catalyst-Eng-22' },
  { value: 'EN-12-Alpha-med-22', label: 'EN-12-Alpha-med-22' },
  { value: 'EN-12-Photon-med-22', label: 'EN-12-Photon-med-22' },
  { value: 'EN-12-Catalyst-med-22', label: 'EN-12-Catalyst-med-22' },
  { value: 'EN-11-Alpha-med-22', label: 'EN-11-Alpha-med-22' },
  { value: 'EN-11-Photon-med-22', label: 'EN-11-Photon-med-22' },
  { value: 'EN-11-Catalyst-med-22', label: 'EN-11-Catalyst-med-22' },
  { value: 'EN-11-Alpha-eng-22', label: 'EN-11-Alpha-eng-22' },
  { value: 'EN-11-Photon-eng-22', label: 'EN-11-Photon-eng-22' },
  { value: 'EN-11-Catalyst-eng-22', label: 'EN-11-Catalyst-eng-22' },
  { value: 'AF-11-Catalyst-22', label: 'AF-11-Catalyst-22' },
  { value: 'AF-12-Catalyst-22', label: 'AF-12-Catalyst-22' },

  { value: 'UK-12-Alpha-Eng-23', label: 'UK-12-Alpha-Eng-23' },
  { value: 'UK-12-Photon-Eng-23', label: 'UK-12-Photon-Eng-23' },
  { value: 'UK-12-Catalyst-Eng-23', label: 'UK-12-Catalyst-Eng-23' },
  { value: 'UK-12-Alpha-med-23', label: 'UK-12-Alpha-med-23' },
  { value: 'UK-12-Photon-med-23', label: 'UK-12-Photon-med-23' },
  { value: 'UK-12-Catalyst-med-23', label: 'UK-12-Catalyst-med-23' },
  { value: 'UK-11-Alpha-med-23', label: 'UK-11-Alpha-med-23' },
  { value: 'UK-11-Photon-med-23', label: 'UK-11-Photon-med-23' },
  { value: 'UK-11-Catalyst-med-23', label: 'UK-11-Catalyst-med-23' },
  { value: 'UK-11-Alpha-eng-23', label: 'UK-11-Alpha-eng-23' },
  { value: 'UK-11-Photon-eng-23', label: 'UK-11-Photon-eng-23' },
  { value: 'UK-11-Catalyst-eng-23', label: 'UK-11-Catalyst-eng-23' },
  { value: 'HR-9-Foundation-mat-22', label: '' },
  { value: 'DL-10-Foundation-sci-22', label: '' },
  { value: 'NEEV L2', label: 'NEEV L2' },
  { value: 'NEEV L3', label: 'NEEV L3' },
  { value: 'NEEV L1', label: 'NEEV L1' },
  { value: 'EN-10-Registration-22', label: 'EN-10-Registration-22' },
  { value: 'EN-10-Registration-23', label: 'EN-10-Registration-23' },
  { value: 'AF-100-physics-22', label: 'AF-100-physics-22' },
  { value: 'AF-100-chemistry-22', label: 'AF-100-chemistry-22' },
  { value: 'AF-100-maths-22', label: 'AF-100-maths-22' },
  { value: 'AF-100-biology-22', label: 'AF-100-biology-22' },
  { value: 'AF-100-physics-23', label: 'AF-100-physics-23' },
  { value: 'AF-100-chemistry-23', label: 'AF-100-chemistry-23' },
  { value: 'AF-100-maths-23', label: 'AF-100-maths-23' },
  { value: 'AF-100-biology-23', label: 'AF-100-biology-23' },
  {
    value: 'CA-100-Hiring-physics-PCMB-23',
    label: 'CA-100-Hiring-physics-PCMB-23',
  },
  { value: 'CA-100-Hiring-chemistry-23', label: 'CA-100-Hiring-chemistry-23' },
  { value: 'CA-100-Hiring-maths-23', label: 'CA-100-Hiring-maths-23' },
  { value: 'CA-100-Hiring-biology-23', label: 'CA-100-Hiring-biology-2' },
  { value: 'CA-100-Hiring-botany-23', label: 'CA-100-Hiring-botany-23' },
  { value: 'CA-100-Hiring-zoology-23', label: 'CA-100-Hiring-zoology-23' },
  { value: 'HP-10-Foundation-sci-22', label: 'HP-10-Foundation-sci-22' },
  { value: 'UK-10-Catalyst-Eng-23', label: 'UK-10-Catalyst-Eng-23' },
  { value: 'AF-10-Foundation-sci-22', label: 'AF-10-Foundation-sci-22' },
  { value: 'NEEV SCERT', label: 'NEEV SCERT' },
];

export const GradeOptions = [
  { value: 9, label: '9' },
  { value: 10, label: '10' },
  { value: 11, label: '11' },
  { value: 12, label: '12' },
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

export const AuthOptions: Option[] = [
  { label: 'ID', value: 'ID' },
  { label: 'ID,PH', value: 'ID,PH' },
  { label: 'ID,DOB', value: 'ID,DOB' },
  { label: 'ID,PH,DOB', value: 'ID,PH,DOB' },
];

export const ActiveDaysOptions: Option[] = [
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
  { label: 'Sunday', value: 7 },
];
