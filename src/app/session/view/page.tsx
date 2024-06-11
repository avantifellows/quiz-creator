import { getASession } from '@/services/services';
import { SessionSearchParams } from '@/types';
import { notFound } from 'next/navigation';

interface Props {
  searchParams: SessionSearchParams;
}

export default async function ViewSession({ searchParams: { id } }: Props) {
  if (!id || typeof parseInt(id) !== 'number') {
    notFound();
  }

  const sessionData = await getASession(Number(id) || null);
  console.log({ sessionData });

  return (
    <main className="container text-center">
      <h2>TO BE IMPLEMENTED</h2>
    </main>
  );
}
