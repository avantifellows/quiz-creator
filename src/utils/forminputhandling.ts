import { RowType } from "@/types/types";
import { instance } from "./RootClient";

// get data from the db
async function getData(page = 1, limit = 5) {
  const { data } = await instance.get(`/quiz?_page=${page}&_limit=${limit}`);
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
