import { z } from 'zod';

const metaDataSchema = z.object({
  admin_testing_link: z.string().url().optional(),
  quiz_batch: z.string().optional(),
  class_batch: z.string().optional(),
  cms_test_id: z.string().url().optional(),
  course: z.string().optional(),
  date_created: z.date().optional(),
  enabled: z.number().int().optional(),
  grade: z.number().int().optional(),
  group: z.string().optional(),
  has_synced_to_bq: z.boolean().optional(),
  infinite_session: z.boolean().optional(),
  marking_scheme: z.string().optional(),
  show_answers: z.boolean().optional(),
  number_of_fields_in_popup_form: z.number().int().optional().or(z.string().optional()),
  optional_limits: z.string().optional(),
  report_link: z.string().url().optional(),
  shortened_link: z.string().url().optional(),
  stream: z.string().optional(),
  test_format: z.string().optional(),
  test_purpose: z.string().optional(),
  test_takers_count: z.number().int().optional(),
  test_type: z.string().optional(),
});

const purposeSchema = z.object({
  params: z.string(),
  type: z.string(),
});

const repeatScheduleSchema = z.object({
  params: z.array(z.number()),
  type: z.string(),
});

export const sessionSchema = z.object({
  auth_type: z.string(),
  created_by_id: z.date(),
  end_time: z.date(),
  id: z.number().int(),
  id_generation: z.boolean(),
  is_active: z.boolean(),
  meta_data: metaDataSchema,
  name: z.string(),
  owner_id: z.string(),
  platform: z.string(),
  platform_id: z.string(),
  platform_link: z.string().url(),
  popup_form: z.boolean(),
  popup_form_id: z.number().nullish(),
  portal_link: z.string().url(),
  purpose: purposeSchema,
  redirection: z.boolean(),
  repeat_schedule: repeatScheduleSchema,
  session_id: z.string(),
  signup_form: z.boolean(),
  signup_form_id: z.number().nullish(),
  start_time: z.date(),
  type: z.string(),
  inserted_at: z.date(),
  updated_at: z.date(),
});

export type Session = Partial<z.infer<typeof sessionSchema>>;
