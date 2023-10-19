import { RowType } from "@/types/types";
import { instance } from "./RootClient";

// get data from the db
async function getData(lastId: number, limit: number) {
  const offsetParam = lastId ? `&offset_id=${lastId}` : " ";
  const { data } = await instance.get(
    `api/session?session_id_is_null=true${offsetParam}&limit=${limit}`
  );
  return data;
}

// post data to the server
async function postFormData(formData: RowType) {
  const currentDate = new Date().toLocaleDateString();

  const res = await instance.post("/quiz", {
    ...formData,
    dateCreated: currentDate,
  });

  return res;
}

export { getData, postFormData };
