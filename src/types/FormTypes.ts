type StudentForm = {
  program: string;
  batch: string;
  grade: string;
  course: string;
  stream: string;
  testTakers: number;
};

type TestForm = {
  name: string;
  type: string;
  format: string;
  purpose: string;
  platform: string;
  markingScheme: string;
  optionalLimit: string;
  link: string;
  id: string;
  sessionId: string;
  sessionLink: string;
  cmsId: string;
};

type TimelineForm = {
  isEnabled: string;
  synced: string;
  sessionType: string;
  reportLink: string;
  repeatSchedule: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
};

type MyForm = StudentForm | TestForm | TimelineForm;
type MyFormKey = keyof StudentForm | keyof TestForm | keyof TimelineForm;

export type { MyForm, MyFormKey, StudentForm, TestForm, TimelineForm };
