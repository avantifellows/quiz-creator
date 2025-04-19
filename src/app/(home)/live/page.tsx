import { getTableData } from '@/services/services';
import { TableParams } from '@/types';
import dynamic from 'next/dynamic';
import Loading from '../loading';
import { columns } from './LiveColumns';
const DataTable = dynamic(() => import('../Table/index'), { loading: Loading });

export default async function Live({ searchParams }: { searchParams: TableParams }) {
  const { data, hasMore, apiOptions } = await getTableData(searchParams, false);

  return <DataTable data={data} hasMore={hasMore} apiOptions={apiOptions} columns={columns} />;
}
