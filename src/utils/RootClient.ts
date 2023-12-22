import axios from "axios";

console.log(process.env.AF_DB_URL);
export const instance = axios.create({
  baseURL: process.env.AF_DB_URL,
  headers: { Authorization: "Bearer " + process.env.AF_BEARER_TOKEN },
});
