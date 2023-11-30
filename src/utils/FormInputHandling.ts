import { RowType } from "@/types/types";
import { instance } from "./RootClient";

// get data from the db
async function getData(currentPage: number, limit: number) {
  const offset = currentPage * limit;
  const { data } = await instance.get(
    `api/session?session_id_is_null=true&offset=${offset}&limit=${limit + 1}`
  );
  const hasMore = data.length > limit;
  const items = hasMore ? data.slice(0, -1) : data;
  return {
    data: items,
    hasMore,
  };
}

function formatDateTime(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  const combinedDate = new Date(year, month - 1, day, hour, minute);
  console.log(combinedDate);

  return combinedDate;
}
// post data to the server
async function postFormData(formData: RowType) {
  const { student, test, timeline, dateCreated, session } = formData;
  console.log(timeline);

  let start_time = formatDateTime(timeline.startDate, timeline.startTime);
  let end_time = formatDateTime(timeline.endDate, timeline.endTime);
  console.log(start_time);

  const requestBody = {
    name: test.name,
    platform: test.platform,
    platform_link: test.platformLink,
    portal_link: "", //responds to the portal link
    start_time,
    end_time,
    is_active: "",
    purpose: {
      type: "attendance",
      params: "quiz",
    },
    repeat_schedule: { type: "weekly", params: [1, 2, 3, 4, 5, 6, 7] }, // this is hardcoded needs to be changed
    session_id: "",
    platform_id: "",
    form_schema_id: session.form_schema_id,
    type: "sign-in",
    auth_type: session.auth_type,
    activate_signup: session.activate_signup,
    id_generation: session.id_generation,
    redirection: session.redirection,
    pop_up_form: session.pop_up_form,
    number_of_fields_in_pop_form: session.number_of_fields_in_pop_form,
    meta_data: {
      group: student.group,
      batch: student.batch,
      grade: student.grade,
      course: student.course,
      stream: student.stream,
      test_format: test.format,
      test_purpose: test.purpose,
      enabled: timeline.isEnabled,
      infinite_session: true,
      cms_test_id: test.cmsId,
      test_takers_count: test.testTakers,
      has_synced_to_bq: false,
      optional_limits: test.optionalLimit,
      marking_scheme: test.markingScheme,
      test_type: test.type,
      shortened_link: "",
      report_link: timeline.reportLink,

      date_created: new Date().toISOString().split("T")[0],
    },
  };

  try {
    const response = await instance.post(
      `${process.env.NEXT_PUBLIC_DB_URL}/api/session`,
      requestBody
    );
    return response.data;
  } catch (error) {
    console.error("Error posting form data", error);
    throw error;
  }
}

export { getData, postFormData };
