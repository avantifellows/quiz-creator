import axios from "axios";

// export const axios_ = axios.create({
//   baseURL: "http://localhost:3001",
// });

export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});
