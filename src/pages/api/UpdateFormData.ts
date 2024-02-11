import { PatchTypes } from "@/types/ResponseTypes";
import { RowType } from "@/types/types";
import { publishMessage } from "@/utils/PublishSnsMessage";
import { instance } from "@/utils/RootClient";
import type { NextApiRequest, NextApiResponse } from "next";

/*
async function formatDateTime(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  const combinedDate = new Date(year, month - 1, day, hour, minute);

  return combinedDate;
}

async function UpdateFormDataToBackend(formData: PatchTypes) {
  const { student, test, timeline, dateCreated, session } = formData;

  let start_time = await formatDateTime(
    timeline.startDate as string,
    timeline.startTime as string
  );
  let end_time = await formatDateTime(
    timeline.endDate as string,
    timeline.endTime as string
  );

  const patchBody = {
    //body change accordingly
    name: test.name, //cannot be changed
    platform: test.platform,
    start_time: start_time,
    end_time: end_time,
    is_active: "",
    purpose: {
      type: "attendance",
      params: "quiz",
    },
    repeat_schedule: { type: "weekly", params: [1, 2, 3, 4, 5, 6, 7] }, // this is hardcoded needs to be changed
    session_id: "",

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
      date_created: new Date().toISOString().split("T")[0],
      admin_testing_link: "",
    },
  };

  try {
    // const response = await instance.patch<PatchTypes>(
    //   `${process.env.AF_DB_URL}/api/session/${id}`,
    //   requestBody
    // );

    // const sessionId = response.data.id;
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
  if (req.method === "PATCH") {
    try {
      const response = await UpdateFormDataToBackend(req.body);
      res.status(200).json(response);
    } catch (error) {
      console.error("Error in API route", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
 */

async function formatDateTime(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const combinedDate = new Date(year, month - 1, day, hour, minute);
  return combinedDate;
}

async function UpdateFormDataToBackend(
  formData: PatchTypes,
  sessionId: string
) {
  const { student, test, timeline, session } = formData;
  console.log(sessionId);

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
    auth_type: session.auth_type,
    activate_signup: session.activate_signup,
    id_generation: session.id_generation,
    redirection: session.redirection,
    pop_up_form: session.pop_up_form,
    number_of_fields_in_pop_form: session.number_of_fields_in_pop_form,
  };

  if (student || test || timeline) {
    patchBody.meta_data = {
      ...(student.program ? { group: student.program } : {}),
      ...(student.batch ? { batch: student.batch } : {}),
      ...(student.grade ? { grade: student.grade } : {}),
      ...(student.course ? { course: student.course } : {}),
      ...(student.stream ? { stream: student.stream } : {}),
      ...(test.format ? { test_format: test.format } : {}),
      ...(test.purpose ? { test_purpose: test.purpose } : {}),
      ...(test.cmsId ? { cms_test_id: test.cmsId } : {}),
      ...(student.testTakers ? { test_takers_count: student.testTakers } : {}),
      ...(test.optionalLimit ? { optional_limits: test.optionalLimit } : {}),
      ...(test.markingScheme ? { marking_scheme: test.markingScheme } : {}),
      ...(test.type ? { test_type: test.type } : {}),
      date_created: new Date().toISOString().split("T")[0],
      infinite_session: true,
      has_synced_to_bq: false,
    };
  }

  try {
    const message = {
      action: "patch",
      id: sessionId,
      patch_session: patchBody,
    };

    publishMessage(JSON.stringify(message));

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
  if (req.method === "PATCH") {
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
