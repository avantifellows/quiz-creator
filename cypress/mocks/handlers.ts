import { utcToISTDate } from '@/lib/time-picker-utils';
import { Platform, STATUS } from '@/types';
import { Session } from '@/types/api.types';
import { bypass, delay, http, HttpResponse } from 'msw';
import initialSessionsData from '../fixtures/initial_sessions.json';
import { PatchLiveData, PatchQuizData } from './mockdata';

const sessions = new Map<number, Session>(
  initialSessionsData.map((session) => [session.id, session as unknown as Session])
);

const API_BASE_URL = process.env.AF_DB_URL;

export const handlers = [
  // Mock for fetching sessions
  http.get(`${API_BASE_URL}/session`, ({ request }) => {
    const url = new URL(request.url);
    const is_quiz = url.searchParams.get('is_quiz') === 'true';
    let result = Array.from(sessions.values())
      .filter((session: Session) => session.id !== undefined)
      .sort((a, b) => (b?.id ?? 0) - (a?.id ?? 0));
    if (is_quiz) {
      result = result.filter((session) => session.platform === Platform.Quiz);
    } else {
      result = result.filter((session) => session.platform !== Platform.Quiz);
    }
    return HttpResponse.json(result);
  }),

  // Mock for fetching a single session
  http.get(`${API_BASE_URL}/session/:id`, ({ params }) => {
    const { id } = params;
    const session = sessions.get(parseInt(id as string));

    if (!session) {
      return new HttpResponse('Session not found', { status: 404 });
    }
    return HttpResponse.json(session);
  }),

  // Mock for creating a session
  http.post(`${API_BASE_URL}/session`, async ({ request }) => {
    const payload = (await request.json()) as Session;
    const lastSessionId = Math.max(...Array.from(sessions.keys()), 0);

    const newSession = {
      ...payload,
      id: lastSessionId + 1,
      meta_data: { ...payload.meta_data, status: STATUS.SUCCESS },
    };
    sessions.set(newSession.id, newSession);
    return HttpResponse.json(newSession);
  }),

  // Mock for patching a session
  http.patch(`${API_BASE_URL}/session/:id`, async ({ params, request }) => {
    const { id } = params;
    const payload = (await request.json()) as Session;
    const sessionId = parseInt(id as string);

    if (sessions.has(sessionId)) {
      const existingSession = sessions.get(sessionId);
      sessions.set(sessionId, { ...existingSession, ...payload });
      mock_sns({ oldSession: sessions.get(sessionId) as Session });
      return HttpResponse.json(sessions.get(sessionId));
    }

    return new HttpResponse('Session not found', { status: 404 });
  }),

  // Mock for fetching auth groups
  http.get(`${API_BASE_URL}/auth-group`, async ({ request }) => {
    const authGroups = await fetch(bypass(request)).then((response) => response.json());
    return HttpResponse.json(authGroups);
  }),

  // Mock for fetching batches
  http.get(`${API_BASE_URL}/batch`, async ({ request }) => {
    const batches = await fetch(bypass(request)).then((response) => response.json());
    return HttpResponse.json(batches);
  }),

  // Mock for fetching form schemas
  http.get(`${API_BASE_URL}/form-schema`, async ({ request }) => {
    const formSchemas = await fetch(bypass(request)).then((response) => response.json());
    return HttpResponse.json(formSchemas);
  }),
];

async function mock_sns({ oldSession }: { oldSession: Session }) {
  let payload: Session = {};
  if (oldSession.platform === Platform.Quiz) {
    const { name, activeDays, endDate, startDate } = PatchQuizData;
    payload = {
      name: name,
      end_time: utcToISTDate(endDate.toUTCString()),
      start_time: utcToISTDate(startDate.toUTCString()),
      repeat_schedule: {
        type: 'weekly',
        params: activeDays,
      },
    };
  } else {
    const { name, activeDays, endDate, startDate } = PatchLiveData;
    payload = {
      name: name,
      end_time: utcToISTDate(endDate.toUTCString()),
      start_time: utcToISTDate(startDate.toUTCString()),
      repeat_schedule: {
        type: 'weekly',
        params: activeDays,
      },
    };
  }
  const newSession = {
    ...oldSession,
    ...payload,
    meta_data: {
      ...(oldSession?.meta_data ?? {}),
      ...(payload?.meta_data ?? {}),
      status: STATUS.SUCCESS,
    },
  };

  await delay(4000);
  sessions.set(newSession.id ?? 0, newSession);
  return;
}
