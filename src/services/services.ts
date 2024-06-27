'use server';

import { DATA_PER_PAGE, KeysToDeleteBeforeUpdate } from '@/Constants';
import { istToUTCDate, utcToISTDate } from '@/lib/time-picker-utils';
import { deleteByPath } from '@/lib/utils';
import { ApiFormOptions, Platform } from '@/types';
import { Session } from '@/types/api.types';
import { instance } from '../lib/axios';
import { publishMessage } from './Aws';

/**
 * Retrieves sessions data from the server.
 *
 * @param {number} currentPage - The current page number.
 * @param {number} limit - The maximum number of items per page.
 * @return {Promise<{data: Session[]; hasMore: boolean}>}
 * - data : array of Session
 * - hasMore : boolean indicating if there are more items
 */
export async function getTableData(currentPage: number, limit: number, filterParams: Object) {
  try {
    const offset = currentPage * DATA_PER_PAGE;

    const filteredParams = Object.entries(filterParams)
      .filter(([key, value]) => value !== undefined && value !== '')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    const { data } = await instance.get<Session[]>(`/session`, {
      params: {
        offset,
        limit,
        sort_order: 'desc',
        ...filteredParams,
      },
    });

    const parsedData = data.map((i) => ({
      ...i,
      start_time: i.start_time ? istToUTCDate(i.start_time) : null,
      end_time: i.end_time ? istToUTCDate(i.end_time) : null,
      meta_data: {
        ...i.meta_data,
        date_created: i.meta_data?.date_created ? istToUTCDate(i.meta_data?.date_created) : null,
      },
    }));

    const hasMore = data.length > DATA_PER_PAGE;
    const items = hasMore ? parsedData.slice(0, -1) : parsedData;
    console.info('[API SUCCESS] fetching sessions : ', {
      length: items.length,
      currentPage,
      filteredParams,
    });
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

    const parsedData = {
      ...data,
      start_time: data.start_time ? istToUTCDate(data.start_time) : null,
      end_time: data.end_time ? istToUTCDate(data.end_time) : null,
      meta_data: {
        ...data.meta_data,
        date_created: data.meta_data?.date_created
          ? istToUTCDate(data.meta_data?.date_created)
          : null,
      },
    };
    console.info(`[API SUCCESS] fetching session ${id} : ${data}`);
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
          has_synced_to_bq: false,
          infinite_session: false,
          date_created: utcToISTDate(new Date()),
        },
        purpose: {
          type: 'attendance',
          params: 'quiz',
        },
        start_time: utcToISTDate(formData.start_time ?? new Date()),
        end_time: utcToISTDate(formData.end_time ?? new Date()),
      };
    } else {
      payload = {
        ...formData,
        session_id: '',
        meta_data: {
          ...formData.meta_data,
          date_created: utcToISTDate(new Date()),
        },
        purpose: '',
        start_time: utcToISTDate(formData.start_time ?? new Date()),
        end_time: utcToISTDate(formData.end_time ?? new Date()),
      };
    }
    console.info(`[PAYLOAD] generated for ${platform} : ${payload}`);
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

/**
 * Patches a session on the server.
 * @param {Session} formData - The session data to be patched.
 * @param {number} id - The id of the session to be patched.
 * @return {Promise<{isSuccess: boolean; id: number}>}
 * - isSuccess : boolean indicating if the session was patched
 * - id : Id of the patched session
 */
export async function patchSession(formData: Session, id: number) {
  try {
    KeysToDeleteBeforeUpdate.forEach((key) => deleteByPath(formData, key));
    const payload = {
      ...formData,
      start_time: utcToISTDate(formData.start_time ?? new Date()),
      end_time: utcToISTDate(formData.end_time ?? new Date()),
    };
    publishMessage({ action: 'patch', id, patch_session: payload });

    console.info(`[SUCCESS] updated session for ${id} : ${payload}`);
    return { isSuccess: true, id };
  } catch (error) {
    console.error('Error posting form data', error);
    return { isSuccess: false };
  }
}

/**
 * Fetch required data from the server
 * - group: List of groups
 * - batch: List of batches
 * - formSchema: List of form schema (popup form and signup form)
 */
export async function getAllOptions(): Promise<ApiFormOptions> {
  try {
    const groupOptions = await getAuthGroups();
    const batchOptions = await getBatches();
    const formSchemaOptions = await getFormSchemas();

    const popupForm = formSchemaOptions?.filter((item) => item.label.includes('Profile'));
    const signupForm = formSchemaOptions?.filter((item) => item.label.includes('Registration'));
    console.info(`[API SUCCESS] fetching options`);

    return {
      group: groupOptions ?? [],
      batch: batchOptions ?? [],
      popupForm: popupForm ?? [],
      signupForm: signupForm ?? [],
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
}

export async function getAuthGroups() {
  try {
    const { data } = await instance.get<Record<string, string>[]>(`/auth-group`);

    const authGroups = data?.map((item) => ({
      label: item.name,
      value: item.name,
      id: item.id,
    }));

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
      parentId: item.parent_id,
      groupId: item.auth_group_id,
    }));

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

    return formSchemas ?? [];
  } catch (error) {
    console.error(`[API ERROR] fetching options : ${error}`);
    return [];
  }
}
