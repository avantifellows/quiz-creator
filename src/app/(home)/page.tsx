import { getFormSchemas, getTableData } from '@/services/services';
import { Platform, TableParams } from '@/types';
import dynamic from 'next/dynamic';
import { columns } from './QuizColumns';
const DataTable = dynamic(() => import('./Table/index'));

interface HomeProps {
  searchParams: TableParams;
}

export default async function Home({ searchParams }: HomeProps) {
  const currentPage = parseInt(searchParams?.page || '0');
  const limit = parseInt(searchParams?.per_page || '10');
  const { data, hasMore } = await getTableData(currentPage, limit + 1, {
    platform: Platform.Quiz,
  });

  const formOptions = await getFormSchemas();

  return <DataTable data={data} hasMore={hasMore} formOptions={formOptions} columns={columns} />;
}
