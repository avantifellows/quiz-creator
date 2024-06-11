import { getTableData } from '@/services/services';
import { TablePrams } from '@/types';
import Link from 'next/link';
import { DataTable } from './Table/Table';

interface HomeProps {
  searchParams: TablePrams;
}

export default async function Home({ searchParams }: HomeProps) {
  const currentPage = parseInt(searchParams?.page || '0');
  const limit = parseInt(searchParams?.per_page || '10');
  const { data, hasMore } = await getTableData(currentPage, limit + 1);

  return (
    <>
      <nav className="flex justify-between m-2 p-5">
        <div className="bg-[#B52326] text-white text-xl px-2 py-2 md:px-3 rounded-md md:text-lg">
          <Link href={'/session/create?step=student'}>+ Create Quiz Session</Link>
        </div>
      </nav>
      <DataTable data={data} hasMore={hasMore} />
    </>
  );
}
