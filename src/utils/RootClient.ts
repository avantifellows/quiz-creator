import axios from "axios";

export const dbInstance = axios.create({
  baseURL: process.env.AF_DB_URL,
  headers: { Authorization: "Bearer " + process.env.AF_BEARER_TOKEN },
});

console.log("******************************************");

(async () => {
  try {
    const data = await test();
    console.log("here is", data);
    // Further code that relies on 'data' can go here
  } catch (error) {
    console.error("Error occurred:", error);
  }
})();

async function test() {
  const { data } = await dbInstance.get(`api/session`, {
    params: {
      session_id_is_null: false,
      offset: 0,
      limit: 3,
      sort_order: "desc",
      platform: "quiz",
    },
  });

  return data;
}
