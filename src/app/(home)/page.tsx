import Table from '@/components/Table';
import { getData } from '@/services/services';
import Link from 'next/link';

interface HomeProps {
  searchParams: {
    page?: string;
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const currentPage = Number(searchParams?.page || 0);
  const { data, hasMore } = await getData(currentPage);

  return (
    <>
      <nav className="flex justify-between m-2 p-5">
        <div className="bg-[#B52326] text-white text-xl px-2 py-2 md:px-3 rounded-md md:text-lg">
          <Link href={'/session/create?step=student'}>+ Create Quiz Session</Link>
        </div>
      </nav>
      <Table data={data} hasMore={hasMore} />
    </>
  );
}
