import axios from "axios";

export const dbInstance = axios.create({
  baseURL: process.env.AF_DB_URL,
  headers: { Authorization: "Bearer " + process.env.AF_BEARER_TOKEN },
});
