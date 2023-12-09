import axios from "axios";

export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DB_URL,
  headers: { Authorization: "Bearer " + process.env.BEARER_TOKEN },
});
