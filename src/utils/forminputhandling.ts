import { RowType } from "@/types/types";
import { instance } from "./RootClient";

// get data from the db
async function getData() {
  const { data } = await instance.get("/quiz");

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

// import { SessionData } from "../types/FormTypes"; // Adjust the import based on where your types are defined
// import { instance } from "./rootclient";

// async function getData(): Promise<SessionData[]> {
//   const { data } = await instance.get("/session"); // Assuming the endpoint is `/session` to get all sessions
//   return data;
// }

// export { getData };
