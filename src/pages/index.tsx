import DataDisplay from '@/components/Table';
import { getData } from '@/services/services';
import { DbTypes } from '@/types/ResponseTypes';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home({
  data,
  hasMore,
  currentPage,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [refreshPage, setrefreshPage] = useState<null | boolean>(null);

  useEffect(() => {
    const shouldRefresh = sessionStorage.getItem('refresh') === 'true';

    let timeout: NodeJS.Timeout;
    if (shouldRefresh) {
      setrefreshPage(true);
      timeout = setTimeout(() => {
        sessionStorage.removeItem('refresh');
        setrefreshPage(false);
      }, 8000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Quiz-creator</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <nav className="flex justify-between m-2 p-5">
        <div className="bg-[#B52326] text-[#FFFFFF] text-[20px] px-2 py-2 md:px-3 rounded-md md:text-lg">
          <Link href={'/Session?type=create'}>+ Create Quiz Session</Link>
        </div>
      </nav>
      {refreshPage && <p>Refresh the page after 1 min</p>}

      <DataDisplay data={data} hasMore={hasMore} currentPage={currentPage} />
    </>
  );
}

export const getServerSideProps = (async ({ query: { pageNo } }) => {
  const currentPage = Number(pageNo) || 0;

  const { data, hasMore } = await getData(currentPage, 10);

  return {
    props: {
      data,
      hasMore,
      currentPage,
    },
  };
}) satisfies GetServerSideProps<{
  data: DbTypes[];
  hasMore: boolean;
  currentPage: number;
}>;
