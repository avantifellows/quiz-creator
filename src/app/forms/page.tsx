import type { Metadata } from 'next';
import { listForms } from '@/services/forms';
import { FormsList } from './FormsList';

export const metadata: Metadata = {
  title: 'Form Builder',
  description: 'Build forms and pick them when creating a form session',
};

// Next.js only allows its own named exports from a page file.
const PAGE_SIZE = 20;

export default async function FormsPage({
  searchParams,
}: {
  searchParams: { search?: string; page?: string };
}) {
  const search = searchParams.search ?? '';
  const page = Math.max(0, Number(searchParams.page) || 0);
  const { items, hasMore, failed } = await listForms({
    search,
    offset: page * PAGE_SIZE,
    limit: PAGE_SIZE,
  });
  return <FormsList forms={items} search={search} page={page} hasMore={hasMore} failed={failed} />;
}
