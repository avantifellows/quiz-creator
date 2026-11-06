import axios from 'axios';

/** quiz-backend (form builder: saved forms). Server-side only — used from server actions. */
export const quizBackend = axios.create({
  baseURL: process.env.AF_QUIZ_BACKEND_URL,
  timeout: 20000,
});
