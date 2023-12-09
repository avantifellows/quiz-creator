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
  portal_link: string;
};

type SessionType = {
  number_of_fields_in_pop_form: number | null;
  form_schema_id: number | null;
  auth_type: null | string;
  id_generation: boolean | null;
  activate_signup: boolean | null;
  redirection: boolean | null;
  pop_up_form: boolean | null;
};

type QuizCreatorForm = StudentForm | TestForm | TimelineForm | SessionType;
type QuizCreatorFormKey =
  | keyof StudentForm
  | keyof TestForm
  | keyof TimelineForm
  | keyof SessionType;

export type {
  QuizCreatorForm,
  QuizCreatorFormKey,
  StudentForm,
  TestForm,
  TimelineForm,
  SessionType,
};
