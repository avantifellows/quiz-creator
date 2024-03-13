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
  const { student, test, timeline } = formData;

  let start_time = await formatDateTime(
    timeline.startDate as string,
    timeline.startTime as string
  );
  let end_time = await formatDateTime(
    timeline.endDate as string,
    timeline.endTime as string
  );
  const sessionStage = {
    number_of_fields_in_pop_form: 3,
    auth_type: "sign-in",
    id_generation: false,
    activate_signup: true,
    redirection: true,
    pop_up_form: true,
  };
  const requestBody = {
    name: test.name,
    platform: test.platform,
    platform_link: "",
    portal_link: "",
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
    // form_schema_id: session.form_schema_id, // should be signup_form_name
    signup_form_name: "Haryana Registration Form",
    type: "sign-in",
    ...sessionStage,
    meta_data: {
      group: student.program,
      batch: student.batch,
      grade: student.grade,
      course: student.course,
      stream: student.stream,
      test_format: test.format,
      test_purpose: test.purpose,
      enabled: timeline.isEnabled,
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
      admin_testing_link: "",
      infinite_session: timeline.infinite_session,
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

async function UpdateFormDataToBackend(formData: RowType, sessionId: string) {
  const { student, test, timeline } = formData;

  let start_time = await formatDateTime(
    timeline.startDate as string,
    timeline.startTime as string
  );
  let end_time = await formatDateTime(
    timeline.endDate as string,
    timeline.endTime as string
  );

  let patchBody: any = {
    start_time,
    end_time,
    signup_form_name: "Haryana Registration Form",
    type: "sign-in",
    number_of_fields_in_pop_form: 3,
    auth_type: "sign-in",
    id_generation: false,
    activate_signup: true,
    redirection: true,
    pop_up_form: true,
    meta_data: {
      group: student.program,
      batch: student.batch,
      grade: student.grade,
      course: student.course,
      stream: student.stream,
      test_format: test.format,
      test_purpose: test.purpose,
      enabled: timeline.isEnabled,
      cms_test_id: test.cmsId,
      test_takers_count: student.testTakers,
      has_synced_to_bq: false,
      optional_limits: test.optionalLimit,
      marking_scheme: test.markingScheme,
      test_type: test.type,
      shortened_link: test.sessionLink,
      report_link: timeline.reportLink,
      date_created: timeline.date_created,
      admin_testing_link: test.link,
      infinite_session: timeline.infinite_session,
    },
  };

  try {
    const message = {
      action: "patch",
      id: sessionId,
      patch_session: patchBody,
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
  } else if (req.method === "PATCH") {
    try {
      const sessionId = req.query.id;
      const response = await UpdateFormDataToBackend(
        req.body,
        sessionId as string
      );

      res.status(200).json(response);
    } catch (error) {
      console.error("Error in API route", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
