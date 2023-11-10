export interface Student {
  [key: string]: string | number | boolean | null;
}

export interface Test {
  [key: string]: string | number | boolean | null;
}

export interface Timeline {
  [key: string]: string | number | boolean | null;
}

export interface DbTypes {
  dateCreated?: string;
  student: Student;
  test: Test;
  timeline: Timeline;
  activate_signup: boolean | null;
  auth_type: null | string;
  created_by_id: null;
  end_time: Date | null;
  form_schema_id: number | null;
  id: number;
  id_generation: boolean | null;
  is_active: boolean;
  meta_data: MetaData | null;
  name: string;
  number_of_fields_in_pop_form: number | null;
  owner_id: null;
  platform: string;
  platform_id: null;
  platform_link: null;
  pop_up_form: boolean | null;
  portal_link: null;
  purpose: Purpose | null;
  redirection: boolean | null;
  repeat_schedule: RepeatSchedule | null;
  session_id: null;
  start_time: Date | null;
  type: null | string;
}

export interface MetaData {
  batch: string;
  cms_test_id: string;
  course: string;
  date_created: string;
  enabled: number;
  grade: string;
  group: string;
  has_synced_to_bq: string;
  infinite_session: boolean;
  marking_scheme: string;
  optional_limits: string;
  report_link: string;
  shortened_link: string;
  stream: string;
  test_format: string;
  test_purpose: string;
  test_takers_count: string;
  test_type: string;
}

export interface Purpose {
  params: string;
  type: string;
}

export interface RepeatSchedule {
  params: number[];
  type: string;
}
