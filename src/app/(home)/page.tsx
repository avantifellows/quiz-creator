import DataDisplay from '@/components/Table';
import { getData } from '@/services/get.services';
import Link from 'next/link';

export default async function Home({
  searchParams,
}: {
  searchParams: { pageNo: string };
}) {
  const currentPage = Number(searchParams?.pageNo || 0);
  const { data, hasMore } = await getData(currentPage, 10);

  return (
    <>
      <nav className="flex justify-between m-2 p-5">
        <div className="bg-[#B52326] text-white text-xl px-2 py-2 md:px-3 rounded-md md:text-lg">
          <Link href={'/Session?type=create'}>+ Create Quiz Session</Link>
        </div>
      </nav>
      <DataDisplay data={data} hasMore={hasMore} currentPage={currentPage} />
    </>
  );
}
