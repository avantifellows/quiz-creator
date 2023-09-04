import { RowType } from "@/types/types";
import { instance } from "./axios";

// get data from the db
async function getData() {
  const { data } = await instance.get("/quiz");

  return data;
}

// post data to the server
async function postFormData(formData: RowType) {
  console.log(formData);

  const res = await instance.post("/quiz", formData);
  console.log(res.data);

  return res;
}

export { getData, postFormData };
