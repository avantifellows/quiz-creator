import { Session } from '@/types';
import { DeepKeys } from '@tanstack/react-table';

export * from './Options';

export const DATA_PER_PAGE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50];

export const KeysToDeleteBeforeDuplicate: DeepKeys<Session>[] = [
  'end_time',
  'start_time',
  'name',
  'id',
  'portal_link',
  'signup_form_id',
  'owner_id',
  'session_id',
  'platform_link',
  'platform_id',
  'created_by_id',
  'inserted_at',
  'updated_at',
  'popup_form_id',
  'meta_data.date_created',
  'meta_data.admin_testing_link',
  'meta_data.cms_test_id',
  'meta_data.test_type',
  'meta_data.report_link',
  'meta_data.shortened_link',
  'meta_data.admin_testing_link',
  'meta_data.has_synced_to_bq',
];
