'use server';

import { DATA_PER_PAGE } from '@/Constants';
import { ApiFormOptions } from '@/types';
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
    console.info('[API SUCCESS] fetching sessions : ', { length: items.length, currentPage });
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
export async function createSession(formData: Session) {
  try {
    const payload: Session = {
      ...formData,
      session_id: '',
      meta_data: {
        ...formData.meta_data,
        report_link: '',
        shortened_link: '',
        has_synced_to_bq: false,
        infinite_session: false,
        date_created: new Date(),
      },
      purpose: {
        type: 'attendance',
        params: 'quiz',
      },
    };
    console.log(payload);
    const { data } = await instance.post<Session>(`/session`, payload);
    // publishMessage({ action: 'db_id', id: data?.id });
    console.info(`[API SUCCESS] created session ${data?.id} : ${data}`);
    return { isSuccess: true, id: data?.id };
  } catch (error) {
    console.error('Error posting form data', error);
    return { isSuccess: false };
  }
}

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
    publishMessage({ action: 'patch', id, patch_session: formData });
    console.info(`[API SUCCESS] updated session for ${id} : ${formData}`);
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
    const { data } = await instance.get<Record<string, string>[]>(`/auth-group/select-columns`, {
      params: { columns: 'id,name' },
    });

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
    const { data } = await instance.get<Record<string, string>[]>(`/batch/select-columns`, {
      params: { columns: 'name,id,parent_id,batch_id,auth_group_id' },
    });

    const batches = data?.map((item) => ({
      label: item.name,
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
    const { data } = await instance.get<Record<string, string>[]>(`/form-schema/select-columns`, {
      params: { columns: 'id,name' },
    });

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
