import { getFormSchemas, getTableData } from '@/services/services';
import { TablePrams } from '@/types';
import dynamic from 'next/dynamic';
const DataTable = dynamic(() => import('./Table/index'));

interface HomeProps {
  searchParams: TablePrams;
}

export default async function Home({ searchParams }: HomeProps) {
  const currentPage = parseInt(searchParams?.page || '0');
  const limit = parseInt(searchParams?.per_page || '10');
  const { data, hasMore } = await getTableData(currentPage, limit + 1);

  const formSchema = await getFormSchemas();

  return <DataTable data={data} hasMore={hasMore} formSchema={formSchema} />;
}
