import { RowType } from "@/types/types";
import { instance } from "./RootClient";
import { DbTypes } from "@/types/ResponseTypes";

// get data from the db when session id is generated
async function getData(currentPage: number, limit: number) {
  const offset = currentPage * limit;
  const { data } = await instance.get<DbTypes[]>(`api/session`, {
    params: {
      session_id_is_null: false,
      offset,
      limit: limit + 1,
      sort_order: "desc",
      platform: "quiz",
    },
  });
  const hasMore = data.length > limit;
  const items = hasMore ? data.slice(0, -1) : data;
  return {
    data: items,
    hasMore,
  };
}

// getting data from db when session_id is null
async function getDataWithoutIds(currentPage: number, limit: number) {
  const offset = currentPage * limit;
  const { data } = await instance.get<DbTypes[]>(`api/session`, {
    params: {
      session_id_is_null: true,
      offset,
      limit: limit + 1,
      sort_order: "desc",
      platform: "quiz",
    },
  });
  const hasMoreNoIds = data.length > limit;
  const items = hasMoreNoIds ? data.slice(0, -1) : data;
  return {
    dataNoIds: items,
    hasMoreNoIds,
  };
}

export { getData, getDataWithoutIds };
