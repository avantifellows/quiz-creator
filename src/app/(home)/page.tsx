import { getTableData } from '@/services/services';
import { TableParams } from '@/types';
import dynamic from 'next/dynamic';
import Loading from '../loading';
import { columns } from './QuizColumns';
const DataTable = dynamic(() => import('./Table/index'), { loading: Loading });

export default async function Home({ searchParams }: { searchParams: TableParams }) {
  const { data, hasMore, apiOptions } = await getTableData(searchParams, true);

  return <DataTable data={data} hasMore={hasMore} apiOptions={apiOptions} columns={columns} />;
}
