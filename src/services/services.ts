'use server';

import { DATA_PER_PAGE, KeysToDeleteBeforeUpdate } from '@/Constants';
import { istToUTCDate, utcToISTDate } from '@/lib/time-picker-utils';
import { deleteByPath, filterObject } from '@/lib/utils';
import { ApiFormOptions, FilterParams, Platform, STATUS, TableParams } from '@/types';
import { Session } from '@/types/api.types';
import { cache } from 'react';
import { instance } from '../lib/axios';
import { publishMessage } from './Aws';

/**
 * Retrieves sessions data from the server.
 *
 * @param {number} filterParams - The filter params.
 * @return {Promise<{data: Session[]; hasMore: boolean}>}
 * - data : array of Session
 * - hasMore : boolean indicating if there are more items
 */
export async function getSessions(filterParams: FilterParams) {
  try {
    const filteredParams = filterObject(filterParams);

    const { data } = await instance.get<Session[]>(`/session`, { params: filteredParams });

    const parsedData = data.map((i) => ({
      ...i,
      start_time: i.start_time ? istToUTCDate(i.start_time) : undefined,
      end_time: i.end_time ? istToUTCDate(i.end_time) : undefined,
      meta_data: {
        ...i.meta_data,
        date_created: i.meta_data?.date_created
          ? istToUTCDate(i.meta_data?.date_created)
          : undefined,
      },
    }));

    const hasMore = data.length === filterParams.limit;
    const items = hasMore ? parsedData.slice(0, -1) : parsedData;
    console.info('[API SUCCESS] fetching sessions : ', {
      length: items.length,
      hasMore,
      filteredParams,
    });
    return { data: items, hasMore };
  } catch (error) {
    console.error(`[API ERROR]  fetching sessions : ${error}`);
    return { data: [], hasMore: false };
  }
}

export async function getTableData(searchParams: TableParams, isQuiz: boolean) {
  const currentPage = parseInt(searchParams?.page || '0');
  const limit = parseInt(searchParams?.per_page || DATA_PER_PAGE.toString());
  const filteredParams = {
    sort_order: 'desc',
    limit: limit + 1,
    offset: currentPage * limit,
    is_quiz: isQuiz,
    group: searchParams?.group,
    parent_id: searchParams?.parentId,
    batch_id: searchParams?.batchId,
  };
  const [sessionRes, apiOptions] = await Promise.all([
    getSessions(filteredParams),
    getAllOptions(),
  ]);
  return { ...sessionRes, apiOptions };
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

    const parsedData = {
      ...data,
      start_time: data.start_time ? istToUTCDate(data.start_time) : undefined,
      end_time: data.end_time ? istToUTCDate(data.end_time) : undefined,
      meta_data: {
        ...data.meta_data,
        date_created: data.meta_data?.date_created
          ? istToUTCDate(data.meta_data?.date_created)
          : undefined,
      },
    };
    console.info(`[API SUCCESS] fetching session ${id} : ${JSON.stringify(parsedData)}`);
    return parsedData;
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
export async function createSession(formData: Session) {
  try {
    const platform = formData?.platform;

    let payload: Session = {};

    // Handle Payload according to Platform
    if (platform === Platform.Quiz) {
      payload = {
        ...formData,
        session_id: '',
        meta_data: {
          ...formData.meta_data,
          report_link: '',
          shortened_link: '',
          shortened_omr_link: '',
          has_synced_to_bq: false,
          infinite_session: false,
          status: STATUS.PENDING,
          date_created: utcToISTDate(new Date().toISOString()),
        },
        purpose: {
          type: 'attendance',
          params: 'quiz',
        },
        start_time: utcToISTDate(formData.start_time ?? ''),
        end_time: utcToISTDate(formData.end_time ?? ''),
      };
    } else {
      payload = {
        ...formData,
        session_id: '',
        meta_data: {
          ...formData.meta_data,
          status: STATUS.PENDING,
          date_created: utcToISTDate(new Date().toISOString()),
        },
        purpose: '',
        start_time: utcToISTDate(formData.start_time ?? ''),
        end_time: utcToISTDate(formData.end_time ?? ''),
      };
    }
    console.info(`[PAYLOAD] generated for ${platform} : ${JSON.stringify(payload)}`);
    const { data } = await instance.post<Session>(`/session`, payload);
    sendCreateSns(data.id);
    console.info(`[API SUCCESS] created session ${data?.id} : ${data}`);
    return { isSuccess: true, id: data?.id };
  } catch (error) {
    console.error('Error posting form data', error);
    return { isSuccess: false };
  }
}

export const sendCreateSns = (id?: number) => publishMessage({ action: 'db_id', id });

export const sendRegenerateSns = (id?: number) => publishMessage({ action: 'regenerate_quiz', id });

/**
 * Patches a session on the server.
 * @param {Session} formData - The session data to be patched.
 * @param {number} id - The id of the session to be patched.
 * @return {Promise<{isSuccess: boolean; id: number}>}
 * - isSuccess : boolean indicating if the session was patched
 * - id : Id of the patched session
 */
export async function patchSession(formData: Session, id: number, oldSession: Session) {
  try {
    // Delete any helper keys we do not want to propagate to the API
    KeysToDeleteBeforeUpdate.forEach((key) => deleteByPath(formData, key));

    // Build a single payload that already contains the latest updates. We keep the
    // status as `PENDING` so that the UI can show the interim disabled state and
    // gets flipped to `SUCCESS` by the background worker shortly afterwards.
    const payload: Session = {
      ...oldSession, // start with the existing data as base
      ...formData, // override with the fields changed in the form
      meta_data: {
        ...oldSession.meta_data,
        ...formData.meta_data,
        date_created: formData.meta_data?.date_created
          ? utcToISTDate(formData.meta_data.date_created)
          : oldSession.meta_data?.date_created,
        status: STATUS.PENDING,
      },
      ...(formData.start_time ? { start_time: utcToISTDate(formData.start_time) } : {}),
      ...(formData.end_time ? { end_time: utcToISTDate(formData.end_time) } : {}),
    };

    // Send the full PATCH update so that list / detail fetches reflect the changes immediately.
    await instance.patch<Session>(`/session/${id}`, payload);

    // Additionally notify the downstream worker to perform any heavy processing.
    publishMessage({ action: 'patch', id, patch_session: payload });

    console.info(`[SUCCESS] updated session for ${id}`);
    return { isSuccess: true, id };
  } catch (error) {
    console.error('Error posting form data', error);
    return { isSuccess: false };
  }
}

/**
 * Marks a session as FAILED on the server due to timeout/stuck PENDING state
 * @param {Session} session - The full session object to preserve metadata
 * @return {Promise<{isSuccess: boolean}>}
 */
export async function markSessionAsFailed(session: Session) {
  try {
    if (!session?.id) {
      console.error('Invalid session: missing id');
      return { isSuccess: false };
    }

    // Merge entire meta_data with status update
    const payload: Session = {
      ...session,
      meta_data: {
        ...session.meta_data,
        status: STATUS.FAILED,
      },
    };

    await instance.patch<Session>(`/session/${session.id}`, payload);
    console.info(`[SUCCESS] marked session ${session.id} as failed due to timeout`);
    return { isSuccess: true };
  } catch (error) {
    console.error(`Error marking session as failed:`, error);
    return { isSuccess: false };
  }
}

/**
 * Fetch required data from the server
 * - group: List of groups
 * - batch: List of batches
 * - formSchema: List of form schema (popup form and signup form)
 */
export const getAllOptions = cache(async function (): Promise<ApiFormOptions> {
  try {
    const [groupOptions, batchOptions, formSchemaOptions] = await Promise.all([
      getAuthGroups(),
      getBatches(),
      getFormSchemas(),
    ]);

    const createFormOptionFilter = (keyword: string) =>
      formSchemaOptions.filter((item) => item.label.includes(keyword));
    const popupForm = createFormOptionFilter('Profile');
    const signupForm = createFormOptionFilter('Registration');
    return {
      group: groupOptions,
      batch: batchOptions,
      popupForm: popupForm,
      signupForm: signupForm,
    };
  } catch (error) {
    console.error(`[API ERROR] fetching options : ${error}`);
    return {
      group: [],
      batch: [],
      popupForm: [],
      signupForm: [],
    };
  }
});

export async function getAuthGroups() {
  try {
    const { data } = await instance.get<Record<string, string>[]>(`/auth-group`);

    const authGroups = data?.map((item) => ({
      label: item.name,
      value: item.name,
      id: item.id,
    }));
    console.info('[API SUCCESS] fetching auth groups : ', authGroups.length);
    return authGroups ?? [];
  } catch (error) {
    console.error(`[API ERROR] fetching options : ${error}`);
    return [];
  }
}

export async function getBatches() {
  try {
    const { data } = await instance.get<Record<string, string>[]>(`/batch`);

    const batches = data?.map((item) => ({
      label: item.batch_id,
      value: item.batch_id,
      id: item.id,
      name: item.name,
      parentId: item.parent_id,
      groupId: item.auth_group_id,
    }));

    console.info('[API SUCCESS] fetching batches : ', batches.length);
    return batches ?? [];
  } catch (error) {
    console.error(`[API ERROR] fetching options : ${error}`);
    return [];
  }
}

export async function getFormSchemas() {
  try {
    const { data } = await instance.get<Record<string, string>[]>(`/form-schema`);

    const formSchemas = data?.map((item) => ({
      label: item.name,
      value: item.id,
    }));

    console.info('[API SUCCESS] fetching form schemas : ', formSchemas.length);
    return formSchemas ?? [];
  } catch (error) {
    console.error(`[API ERROR] fetching options : ${error}`);
    return [];
  }
}
