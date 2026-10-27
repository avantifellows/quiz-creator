'use server';

import { isAxiosError } from 'axios';
import { requireActorEmail } from '@/lib/auth';
import { quizBackend } from '@/lib/quizBackend';
import type {
  FormDefinition,
  FormDefinitionContent,
  FormSession,
  FormSummary,
} from '@/app/form-builder/lib/definition';

/*
 * Forms built in the form builder, stored by quiz-backend (docs/form-builder). Reads return
 * a safe fallback on failure, like services.ts; writes report what went wrong so the builder
 * can tell the author (a 409 means the form was used in a session and is locked).
 */

export interface FormWriteResult {
  isSuccess: boolean;
  id?: string;
  /** The form is used by a session, so it can't be changed or deleted (decision D13). */
  locked?: boolean;
  error?: string;
}

function describe(error: unknown): { locked: boolean; error: string } {
  if (isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    const message = Array.isArray(detail)
      ? detail.map((d) => (typeof d === 'string' ? d : d?.msg)).join('; ')
      : typeof detail === 'string'
        ? detail
        : error.message;
    return { locked: error.response?.status === 409, error: message };
  }
  return { locked: false, error: String(error) };
}

export async function listForms({
  search = '',
  offset = 0,
  limit = 20,
  readyOnly = false,
}: {
  search?: string;
  offset?: number;
  limit?: number;
  readyOnly?: boolean;
}): Promise<{ items: FormSummary[]; hasMore: boolean; failed: boolean }> {
  try {
    const { data } = await quizBackend.get('/form-definitions/', {
      params: { search: search || undefined, offset, limit, ready_only: readyOnly || undefined },
    });
    return { items: data.items, hasMore: data.has_more, failed: false };
  } catch (error) {
    console.error('[API ERROR] listForms', describe(error).error);
    return { items: [], hasMore: false, failed: true };
  }
}

export async function getForm(id: string): Promise<FormDefinition | null> {
  try {
    const { data } = await quizBackend.get<FormDefinition>(
      `/form-definitions/${encodeURIComponent(id)}`
    );
    return data;
  } catch (error) {
    console.error('[API ERROR] getForm', id, describe(error).error);
    return null;
  }
}

export async function getFormSessions(id: string): Promise<FormSession[] | null> {
  try {
    const { data } = await quizBackend.get<FormSession[]>(
      `/form-definitions/${encodeURIComponent(id)}/sessions`
    );
    return data;
  } catch (error) {
    console.error('[API ERROR] getFormSessions', id, describe(error).error);
    return null;
  }
}

export async function createForm(content: FormDefinitionContent): Promise<FormWriteResult> {
  const actor = await requireActorEmail();
  try {
    const { data } = await quizBackend.post('/form-definitions/', { ...content, actor });
    console.info('[API SUCCESS] createForm', data.id);
    return { isSuccess: true, id: data.id };
  } catch (error) {
    console.error('[API ERROR] createForm', describe(error).error);
    return { isSuccess: false, ...describe(error) };
  }
}

export async function saveForm(
  id: string,
  content: FormDefinitionContent
): Promise<FormWriteResult> {
  const actor = await requireActorEmail();
  try {
    await quizBackend.put(`/form-definitions/${encodeURIComponent(id)}`, { ...content, actor });
    console.info('[API SUCCESS] saveForm', id);
    return { isSuccess: true, id };
  } catch (error) {
    console.error('[API ERROR] saveForm', id, describe(error).error);
    return { isSuccess: false, ...describe(error) };
  }
}

export async function deleteForm(id: string): Promise<FormWriteResult> {
  await requireActorEmail();
  try {
    await quizBackend.delete(`/form-definitions/${encodeURIComponent(id)}`);
    console.info('[API SUCCESS] deleteForm', id);
    return { isSuccess: true, id };
  } catch (error) {
    console.error('[API ERROR] deleteForm', id, describe(error).error);
    return { isSuccess: false, ...describe(error) };
  }
}
