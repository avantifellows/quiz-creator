'use server';
import { instance } from '@/lib/axios';
import { publishMessage } from '@/services/Aws.lamda';

export async function createSession(formData: FormData) {
  try {
    const response = await instance.post(`/api/session`, {});

    const sessionId = response.data.id;
    const message = {
      action: 'db_id',
      id: sessionId,
    };

    publishMessage(message);

    return {
      id: sessionId,
    };
  } catch (error) {
    console.error('Error posting form data', error);
    throw error;
  }
}

export async function updateSession(formData: FormData) {
  try {
    const message = {
      action: 'patch',
      // id: sessionId,
      // patch_session: patchBody,
    };
    publishMessage(message);

    return {
      // id: sessionId,
    };
  } catch (error) {
    console.error('Error posting form data', error);
    throw error;
  }
}
