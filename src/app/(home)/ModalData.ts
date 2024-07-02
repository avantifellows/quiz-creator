import { ActiveDaysOptions } from '@/Constants';
import { DataSection, Option, Session } from '@/types';
import { format } from 'date-fns';

export const displayData = (data: Session, formOptions: Option[]) => {
  const basicDetails: DataSection = {
    title: 'Basic Details',
    data: [
      { label: 'Program', value: data.meta_data?.group },
      { label: 'Quiz Batch', value: data.meta_data?.parent_id },
      { label: 'Class Batch', value: data.meta_data?.batch_id },
      { label: 'Grade', value: data.meta_data?.grade },
      { label: 'Auth Type', value: data.auth_type },
      { label: 'Platform', value: data.platform },
      { label: 'Session Type', value: data.type },
      { label: 'Is Sign Up Form?', value: data.signup_form ? 'Yes' : 'No' },
      {
        label: 'Sign Up Form Name',
        value: formOptions.find((i) => i.value === data.signup_form_id)?.label ?? 'N/A',
      },
      { label: 'Is Popup Form Allowed?', value: data.popup_form ? 'Yes' : 'No' },
      {
        label: 'Popup Form Name',
        value: formOptions.find((i) => i.value === data.popup_form_id)?.label ?? 'N/A',
      },
      {
        label: 'No Of Fields In Popup',
        value: data.meta_data?.number_of_fields_in_popup_form,
      },
      { label: 'Is Redirection Allowed?', value: data.redirection ? 'Yes' : 'No' },
      { label: 'Is ID Generation Allowed?', value: data.id_generation ? 'Yes' : 'No' },
    ],
  };

  const quizDetails: DataSection = {
    title: 'Quiz Details',
    data: [
      { label: 'Course', value: data.meta_data?.course },
      { label: 'Stream', value: data.meta_data?.stream },
      { label: 'Test Name', value: data.name },
      { label: 'Test Format', value: data.meta_data?.test_format },
      { label: 'Test Purpose', value: data.meta_data?.test_purpose },
      { label: 'Test Type', value: data.meta_data?.test_type },
      {
        label: 'CMS Link',
        value: data.meta_data?.cms_test_id ?? 'N/A',
        isLink: !!data.meta_data?.cms_test_id,
      },
      { label: 'Marking Scheme', value: data.meta_data?.marking_scheme },
      { label: 'Optional Limits', value: data.meta_data?.optional_limits },
      { label: 'Show Answers', value: data.meta_data?.show_answers ? 'Yes' : 'No' },
      { label: 'Portal Link', value: data.portal_link ?? 'N/A', isLink: !!data.portal_link },
      {
        label: 'Admin Link',
        value: data.meta_data?.admin_testing_link ?? 'N/A',
        isLink: !!data.meta_data?.admin_testing_link,
      },
      {
        label: 'Report Link',
        value: data.meta_data?.report_link ?? 'N/A',
        isLink: !!data.meta_data?.report_link,
      },
    ],
  };

  const liveDetails: DataSection = {
    title: 'Session Details',
    data: [
      { label: 'Session Name', value: data.name },
      { label: 'Subject', value: data.meta_data?.subject ?? 'N/A' },
      { label: 'Portal Link', value: data.portal_link ?? 'N/A', isLink: !!data.portal_link },
      { label: 'Platform ID', value: data.platform_id ?? 'N/A' },
      {
        label: 'Platform Link',
        value: data.platform_link ?? 'N/A',
        isLink: !!data.platform_link,
      },
    ],
  };

  const timeDetails: DataSection = {
    title: 'Time Details',
    data: [
      { label: 'Start Date & Time', value: format(new Date(data.start_time!), 'PPp') },
      { label: 'End Date & Time', value: format(new Date(data.end_time!), 'PPp') },
      { label: 'Expected Attendance', value: data.meta_data?.test_takers_count },
      { label: 'Is Enabled?', value: data.is_active ? 'Yes' : 'No' },
      { label: 'Has Synced?', value: data.meta_data?.has_synced_to_bq },
      {
        label: 'Created At',
        value: data.meta_data?.date_created
          ? format(new Date(data.meta_data?.date_created), 'PPp')
          : 'N/A',
      },
      {
        label: 'Active Days',
        value:
          data.repeat_schedule?.params
            ?.map((value) => ActiveDaysOptions.find((option) => option.value === value)?.label)
            .join(', ') ?? 'N/A',
      },
    ],
  };

  // Filter out any null sections
  data.platform === 'quiz';
  const showingData: DataSection[] = [
    basicDetails,
    data.platform === 'quiz' ? quizDetails : liveDetails,
    timeDetails,
  ].filter(Boolean) as DataSection[];

  return showingData;
};
