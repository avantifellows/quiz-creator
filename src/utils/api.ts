import { RowType } from "@/types/types";
import { axios_ } from "./axios";

// get data from the db
async function getData() {
  const { data } = await axios_.get("/quiz");

  return data;
}

// post data to the server
async function postFormData(formData: RowType) {
  console.log(formData);

  const res = await axios_.post("/quiz", formData);
  console.log(res.data);

  return res;
}

export { getData, postFormData };
