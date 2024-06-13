'use server';

import { DATA_PER_PAGE } from '@/Constants';
import { publishMessage } from '@/services/Aws';
import { PartialSession, Session } from '@/types/api.types';
import { instance } from '../lib/axios';

/**
 * Retrieves sessions data from the server.
 *
 * @param {number} currentPage - The current page number.
 * @param {number} limit - The maximum number of items per page.
 * @return {Promise<{data: Session[]; hasMore: boolean}>}
 * - data : array of Session
 * - hasMore : boolean indicating if there are more items
 */
export async function getTableData(currentPage: number, limit: number) {
  try {
    const offset = currentPage * DATA_PER_PAGE;
    const { data } = await instance.get<Session[]>(`/session`, {
      params: {
        offset,
        limit,
        sort_order: 'desc',
        platform: 'quiz',
      },
    });
    const hasMore = data.length > DATA_PER_PAGE;
    const items = hasMore ? data.slice(0, -1) : data;
    console.info('[API SUCCESS] fetching sessions : ', { items, hasMore });
    return { data: items, hasMore };
  } catch (error) {
    console.error(`[API ERROR]  fetching sessions : ${error}`);
    return { data: [], hasMore: false };
  }
}

/**
 * Retrieves a particular session data from the server.
 * @param {number} id - The id of the session.
 * @return {Promise<Session>} data - Session data for the given id
 */
export async function getASession(id: number | null): Promise<Session | {}> {
  if (!id) return {};
  try {
    const { data } = await instance.get<Session>(`/session/${id}`);
    console.info(`[API SUCCESS] fetching session ${id} : ${data}`);
    return data;
  } catch (error) {
    console.error(`[API ERROR] fetching session for ${id} : ${error}`);
    return {};
  }
}

/**
 * Creates a new session on the server.
 * @param {Session} formData - The session data to be created.
 * @return {Promise<{isSuccess: boolean; id: number}>}
 * - isSuccess : boolean indicating if the session was created successfully
 * - id : Id of the created session
 */
export async function createSession(formData: PartialSession) {
  try {
    const { data } = await instance.post<PartialSession>(`/session`, formData);
    publishMessage({ action: 'db_id', id: data?.id });
    console.info(`[API SUCCESS] created session ${data?.id} : ${data}`);
    return { isSuccess: true, id: data?.id };
  } catch (error) {
    console.error('Error posting form data', error);
    throw error;
  }
}

/**
 * Patches a session on the server.
 * @param {PartialSession} formData - The session data to be patched.
 * @param {number} id - The id of the session to be patched.
 * @return {Promise<{isSuccess: boolean; id: number}>}
 * - isSuccess : boolean indicating if the session was patched
 * - id : Id of the patched session
 */
export async function updateSession(formData: PartialSession, id: number) {
  try {
    publishMessage({ action: 'patch', id, patch_session: formData });
    console.info(`[API SUCCESS] updated session for ${id} : ${formData}`);
    return { isSuccess: true, id };
  } catch (error) {
    console.error('Error posting form data', error);
    throw error;
  }
}
