import { http, HttpResponse } from 'msw';
import initialSessions from '../fixtures/initial_sessions.json';

const API_BASE_URL = process.env.AF_DB_URL;
export const handlers = [
  http.get(API_BASE_URL + '/session', () => {
    return HttpResponse.json(initialSessions);
  }),
];
