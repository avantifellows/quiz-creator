import { DATA_PER_PAGE } from '@/Constants';
import { Session } from '@/types/api.types';
import { instance } from '../lib/axios';

// get data from the db when session id is generated
export async function getTableData(currentPage: number, limit: number) {
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
  return { data: items, hasMore };
}

export async function getASession(id: number | null) {
  if (id === null) {
    return {};
  }

  const { data } = await instance.get<Session>(`/session/${id}`);
  return data;
}
