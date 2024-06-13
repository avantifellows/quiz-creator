export interface Session {
  auth_type?: string;
  created_by_id?: null;
  end_time?: Date;
  id: number;
  id_generation?: boolean;
  is_active?: boolean;
  meta_data?: MetaData;
  name?: string;
  owner_id?: null;
  platform?: string;
  platform_id?: string;
  platform_link?: string;
  popup_form?: boolean;
  popup_form_id?: null;
  portal_link?: string;
  purpose?: Purpose;
  redirection?: boolean;
  repeat_schedule?: RepeatSchedule;
  session_id?: string;
  signup_form?: boolean;
  signup_form_id?: null;
  start_time?: Date;
  type?: string;
}

interface MetaData {
  admin_testing_link?: string;
  batch?: string;
  cms_test_id?: string;
  course?: string;
  date_created?: Date;
  enabled?: number;
  grade?: string;
  group?: string;
  has_synced_to_bq?: string;
  infinite_session?: boolean;
  marking_scheme?: string;
  number_of_fields_in_popup_form?: string;
  optional_limits?: string;
  report_link?: string;
  shortened_link?: string;
  stream?: string;
  test_format?: string;
  test_purpose?: string;
  test_takers_count?: string;
  test_type?: string;
}

interface Purpose {
  params?: string;
  type?: string;
}

interface RepeatSchedule {
  params?: number[];
  type?: string;
}

export type PartialSession = Partial<Session>;
