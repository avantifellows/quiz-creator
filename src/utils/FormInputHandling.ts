import { RowType } from "@/types/types";
import { dbInstance } from "./RootClient";
import { DbTypes } from "@/types/ResponseTypes";

// get data from the db when session id is generated
async function getData(currentPage: number, limit: number) {
  const offset = currentPage * limit;
  console.log(dbInstance.defaults.baseURL);
  console.log(dbInstance.defaults.headers); // Log the default headers
  const { data } = await dbInstance.get<DbTypes[]>(`api/session`, {
    params: {
      session_id_is_null: false,
      offset,
      limit: limit + 1,
      sort_order: "desc",
      platform: "quiz",
    },
  });
  const hasMore = data.length > limit;
  const items = hasMore ? data.slice(0, -1) : data;
  return {
    data: items,
    hasMore,
  };
}

// getting data from db when session_id is null
async function getDataNoLinks(currentPage: number, limit: number) {
  const offset = currentPage * limit;
  const { data } = await dbInstance.get<DbTypes[]>(`api/session`, {
    params: {
      session_id_is_null: true,
      offset,
      limit: limit + 1,
      sort_order: "desc",
      platform: "quiz",
    },
  });
  const hasMoreNoLinks = data.length > limit;
  const items = hasMoreNoLinks ? data.slice(0, -1) : data;
  return {
    dataNoLinks: items,
    hasMoreNoLinks,
  };
}

function formatDateTime(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  const combinedDate = new Date(year, month - 1, day, hour, minute);

  return combinedDate;
}
// post data to the server
async function postFormData(formData: RowType) {
  const { student, test, timeline, dateCreated, session } = formData;

  let start_time = formatDateTime(
    timeline.startDate as string,
    timeline.startTime as string
  );
  let end_time = formatDateTime(
    timeline.endDate as string,
    timeline.endTime as string
  );

  const requestBody = {
    name: test.name,
    platform: test.platform,
    platform_link: "",
    portal_link: "", //responds to the portal link
    start_time: start_time,
    end_time: end_time,
    is_active: "",
    purpose: {
      type: "attendance",
      params: "quiz",
    },
    repeat_schedule: { type: "weekly", params: [1, 2, 3, 4, 5, 6, 7] }, // this is hardcoded needs to be changed
    session_id: "",
    platform_id: "",
    // form_schema_id: session.form_schema_id, // should be signup_form_name
    signup_form_name: "Haryana Registration Form",
    type: "sign-in",
    auth_type: session.auth_type,
    activate_signup: session.activate_signup,
    id_generation: session.id_generation,
    redirection: session.redirection,
    pop_up_form: session.pop_up_form,
    number_of_fields_in_pop_form: session.number_of_fields_in_pop_form,
    meta_data: {
      group: student.program,
      batch: student.batch,
      grade: student.grade,
      course: student.course,
      stream: student.stream,
      test_format: test.format,
      test_purpose: test.purpose,
      enabled: timeline.isEnabled,
      infinite_session: true,
      cms_test_id:
        // "https://cms.peerlearning.com/chapter_tests/655df9a23562d97a6300b53e",
        test.cmsId,
      test_takers_count: student.testTakers,
      has_synced_to_bq: false,
      optional_limits: test.optionalLimit,
      marking_scheme: test.markingScheme,
      test_type: test.type,
      shortened_link: "",
      report_link: "",
      date_created: new Date().toISOString().split("T")[0],
    },
  };

  try {
    const response = await dbInstance.post(
      `${process.env.AF_DB_URL}/api/session`,
      requestBody
    );
    const sessionId = response.data.id;
    return {
      id: sessionId,
    };
  } catch (error) {
    console.error("Error posting form data", error);
    throw error;
  }
}

export { getData, postFormData, getDataNoLinks };
