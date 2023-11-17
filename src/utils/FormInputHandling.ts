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

// post data to the server
async function postFormData(formData: RowType) {
  const { student, test, timeline, dateCreated } = formData;
  let start_time = timeline.startDate + "T" + timeline.startTime + ":00";
  let end_time = timeline.endDate + "T" + timeline.endTime + ":00";
  const requestBody = {
    name: test.name,
    platform: test.platform,
    platform_link: test.platformLink,
    portal_link: test.portalLink,
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
    form_schema_id: "1",
    type: "sign-in",
    auth_type: "ID",
    activate_signup: true,
    id_generation: false,
    redirection: false,
    pop_up_form: true,
    number_of_fields_in_pop_form: "3",
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
      cms_test_id: test.cmdId,
      test_takers_count: test.testTakers,
      has_synced_to_bq: true,
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
      "https://staging-db.avantifellows.org/api/session",
      requestBody
    );
    return response.data;
  } catch (error) {
    console.error("Error posting form data", error);
    throw error;
  }
}

export { getData, postFormData };
