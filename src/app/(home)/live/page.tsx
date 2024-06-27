import { getFormSchemas, getTableData } from '@/services/services';
import { TableParams } from '@/types';
import dynamic from 'next/dynamic';
import { columns } from './LiveColumns';
const DataTable = dynamic(() => import('../Table/index'));

interface HomeProps {
  searchParams: TableParams;
}

export default async function Home({ searchParams }: HomeProps) {
  const currentPage = parseInt(searchParams?.page || '0');
  const limit = parseInt(searchParams?.per_page || '10');

  const { data, hasMore } = await getTableData(currentPage, limit + 1, { is_quiz: false });
  const formOptions = await getFormSchemas();

  return <DataTable data={data} hasMore={hasMore} formOptions={formOptions} columns={columns} />;
}
