import { RowType } from "@/types/types";
import { publishMessage } from "@/utils/PublishSnsMessage";
import { instance } from "@/utils/RootClient";
import type { NextApiRequest, NextApiResponse } from "next";

async function formatDateTime(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  const combinedDate = new Date(year, month - 1, day, hour, minute);

  return combinedDate;
}

async function postFormDataToBackend(formData: RowType) {
  const { student, test, timeline, dateCreated, session } = formData;

  let start_time = await formatDateTime(
    timeline.startDate as string,
    timeline.startTime as string
  );
  let end_time = await formatDateTime(
    timeline.endDate as string,
    timeline.endTime as string
  );

  const requestBody = {
    name: test.name, //x
    platform: test.platform, //x
    platform_link: "", //x
    portal_link: "", //responds to the portal link //x
    start_time: start_time,
    end_time: end_time,
    is_active: "",
    purpose: {
      //x
      type: "attendance",
      params: "quiz",
    },
    repeat_schedule: { type: "weekly", params: [1, 2, 3, 4, 5, 6, 7] }, // this is hardcoded needs to be changed
    session_id: "", //x
    platform_id: "", //x
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
      group: student.program, //x
      batch: student.batch,
      grade: student.grade,
      course: student.course,
      stream: student.stream,
      test_format: test.format,
      test_purpose: test.purpose,
      enabled: timeline.isEnabled, //remove it as it not used
      cms_test_id:
        // "https://cms.peerlearning.com/chapter_tests/655df9a23562d97a6300b53e",
        test.cmsId, //x
      test_takers_count: student.testTakers,
      has_synced_to_bq: false,
      optional_limits: test.optionalLimit,
      marking_scheme: test.markingScheme,
      test_type: test.type,
      shortened_link: "", //x
      report_link: "", //x
      date_created: new Date().toISOString().split("T")[0], //x
      admin_testing_link: "", //x
    },
  };

  try {
    const response = await instance.post(
      `${process.env.AF_DB_URL}/api/session`,
      requestBody
    );

    const sessionId = response.data.id;
    const message = {
      action: "db_id",
      id: sessionId,
    };
    publishMessage(message);
    return {
      id: sessionId,
    };
  } catch (error) {
    console.error("Error posting form data", error);
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const response = await postFormDataToBackend(req.body);
      res.status(200).json(response);
    } catch (error) {
      console.error("Error in API route", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
