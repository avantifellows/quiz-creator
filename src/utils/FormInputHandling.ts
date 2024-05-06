import { instance } from "./RootClient";
import { DbTypes } from "@/types/ResponseTypes";
import { formatDateForPicker } from "./TimeFormatter";
import { formatTimeForPicker } from "./TimeFormatter";

// get data from the db when session id is generated
async function getData(currentPage: number, limit: number) {
  const offset = currentPage * limit;
  const { data } = await instance.get<DbTypes[]>(`api`)
  const hasMore = data.length > limit;
  const items = hasMore ? data.slice(0, -1) : data;

  return {
    data: items,
    hasMore,
  };
}

async function getASession(id: number) {
  const { data } = await instance.get<DbTypes>(`api/${id}`);
  const startDate = formatDateForPicker(new Date(data.start_time!));
  const endDate = formatDateForPicker(new Date(data.end_time!));

  const startTime = formatTimeForPicker(new Date(data.start_time!));

  const endTime = formatTimeForPicker(new Date(data.end_time!));

  return {
    student: {
      program: data.meta_data?.group,
      batch: data.meta_data?.batch,
      grade: data.meta_data?.grade,
      course: data.meta_data?.course,
      stream: data.meta_data?.stream,
      testTakers: data.meta_data?.test_takers_count,
    },
    test: {
      name: data.name,
      type: data.meta_data?.test_type,
      format: data.meta_data?.test_format,
      purpose: data.meta_data?.test_purpose,
      platform: data.platform,
      markingScheme: data.meta_data?.marking_scheme,
      optionalLimit: data.meta_data?.optional_limits,
      link: data.meta_data?.admin_testing_link || null,
      id: data.id,
      sessionId: data.session_id,
      sessionLink: data.meta_data?.shortened_link || null,
      cmsId: data.meta_data?.cms_test_id,
    },
    timeline: {
      isEnabled: data.meta_data?.enabled || null,
      synced: data.meta_data?.has_synced_to_bq,
      infinite_session: data.meta_data?.infinite_session,
      reportLink: data.meta_data?.report_link || null,
      repeatSchedule: data.repeat_schedule,
      startDate: startDate,
      endDate: endDate,
      startTime: startTime,
      endTime: endTime,
      portal_link: data.portal_link,
      date_created: data.meta_data?.date_created,
    },
  };
}

export { getData, getASession };
