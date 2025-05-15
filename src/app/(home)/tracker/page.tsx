import { getTableData } from '@/services/services';
import { TableParams } from '@/types';
import dynamic from 'next/dynamic';
import { columns } from './TrackerColumns';
import TrackerTable from './TrackerTable';

export default async function Tracker({ searchParams }: { searchParams: TableParams }) {
  const { data, hasMore, apiOptions } = await getTrackerData(searchParams);

  return <TrackerTable data={data} hasMore={hasMore} apiOptions={apiOptions} columns={columns} />;
}
