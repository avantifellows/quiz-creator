import { getHomeOptions, getTableData } from '@/services/services';
import { TableParams } from '@/types';
import dynamic from 'next/dynamic';
import { columns } from './QuizColumns';
const DataTable = dynamic(() => import('./Table/index'));

interface HomeProps {
  searchParams: TableParams;
}

export default async function Home({ searchParams }: HomeProps) {
  const { data, hasMore } = await getTableData(searchParams, true);
  const apiOptions = await getHomeOptions();

  return <DataTable data={data} hasMore={hasMore} apiOptions={apiOptions} columns={columns} />;
}
